import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  addToCartSchema,
  updateCartItemSchema
} from '../utils/validation';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true
    }
  });

  // Create cart if it doesn't exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true }
    });
  }

  return res.json({
    success: true,
    data: cart
  });
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const validation = addToCartSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { productId, quantity } = validation.data;
  const userId = req.user!.id;

  // Check if product exists and has stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      error: `Only ${product.stock} items in stock`
    });
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true }
    });
  }

  // Check if item already in cart
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    // Update existing item
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      }
    });

    return res.json({
      success: true,
      data: updatedItem,
      message: 'Cart item updated'
    });
  }

  // Add new item to cart
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      title: product.title,
      price: product.price,
      image: product.images[0] || undefined
    }
  });

  return res.status(201).json({
    success: true,
    data: cartItem,
    message: 'Item added to cart'
  });
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const validation = updateCartItemSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { quantity } = validation.data;
  const userId = req.user!.id;

  // Find cart item and verify ownership
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: { cart: true }
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Cart item not found'
    });
  }

  // Check stock
  const product = await prisma.product.findUnique({
    where: { id: cartItem.productId }
  });

  if (product && product.stock < quantity) {
    return res.status(400).json({
      success: false,
      error: `Only ${product.stock} items in stock`
    });
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity }
  });

  return res.json({
    success: true,
    data: updatedItem,
    message: 'Cart item updated'
  });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  // Find cart item and verify ownership
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: { cart: true }
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Cart item not found'
    });
  }

  await prisma.cartItem.delete({
    where: { id }
  });

  return res.json({
    success: true,
    message: 'Item removed from cart'
  });
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    return res.json({
      success: true,
      message: 'Cart is already empty'
    });
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  return res.json({
    success: true,
    message: 'Cart cleared'
  });
};
