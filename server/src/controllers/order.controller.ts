import { Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_default', {
  apiVersion: '2023-10-16'
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    success: true,
    data: orders
  });
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true
    }
  });

  if (!order || order.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  return res.json({
    success: true,
    data: order
  });
};

// @desc    Create checkout session (for Stripe)
// @route   POST /api/orders/checkout
// @access  Private
export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true
    }
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Your cart is empty'
    });
  }

  // Get products to verify stock and get prices
  const productIds = cart.items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  // Check stock and prepare line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const cartItem of cart.items) {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        error: `Product not found: ${cartItem.productId}`
      });
    }
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock for ${product.title}`
      });
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          images: product.images || []
        },
        unit_amount: Math.round(Number(product.price) * 100)
      },
      quantity: cartItem.quantity
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        userId: userId,
        cartId: cart.id
      }
    });

    return res.json({
      success: true,
      data: { sessionId: session.id, url: session.url }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
};

// @desc    Handle successful checkout
// @route   POST /api/orders/confirm
// @access  Private
export const confirmOrder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { sessionId } = req.body;

  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty or address not selected'
      });
    }

    // For now, we'll use the first address or require it to be set
    const address = await prisma.address.findFirst({
      where: { userId }
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Please add a shipping address first'
      });
    }

    // Get products
    const productIds = cart.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const totalAmount = cart.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (Number(product?.price || 0) * item.quantity);
    }, 0);

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PLACED',
          paymentId: sessionId
        }
      });

      // Create order items
      for (const cartItem of cart.items) {
        const product = products.find(p => p.id === cartItem.productId)!;
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            title: product.title,
            price: product.price,
            quantity: cartItem.quantity
          }
        });

        // Update product stock
        await tx.product.update({
          where: { id: cartItem.productId },
          data: { stock: product.stock - cartItem.quantity }
        });
      }

      // Create order address snapshot
      await tx.orderAddress.create({
        data: {
          orderId: newOrder.id,
          fullName: address.fullName,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        }
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to confirm order'
    });
  }
};
