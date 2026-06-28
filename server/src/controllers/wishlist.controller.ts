import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: true
    }
  });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: { items: true }
    });
  }

  return res.json({
    success: true,
    data: wishlist
  });
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.body;
  const userId = req.user!.id;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Get or create wishlist
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: { items: true }
    });
  }

  // Check if item already in wishlist
  const existingItem = wishlist.items.find(
    item => (item as any).productId === productId
  );

  if (existingItem) {
    return res.status(400).json({
      success: false,
      error: 'Item already in wishlist'
    });
  }

  // Add to wishlist (store snapshot)
  const wishlistItem = await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      title: product.title,
      image: product.images[0] || undefined
    }
  });

  return res.status(201).json({
    success: true,
    data: wishlistItem,
    message: 'Item added to wishlist'
  });
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  // Find wishlist item and verify ownership
  const wishlistItem = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: true }
  });

  if (!wishlistItem || wishlistItem.wishlist.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Wishlist item not found'
    });
  }

  await prisma.wishlistItem.delete({
    where: { id }
  });

  return res.json({
    success: true,
    message: 'Item removed from wishlist'
  });
};
