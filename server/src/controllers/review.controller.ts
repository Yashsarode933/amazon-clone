import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createReviewSchema } from '../utils/validation';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    success: true,
    data: reviews
  });
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  const validation = createReviewSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { productId, rating, comment } = validation.data;
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

  // Check if user already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      error: 'You have already reviewed this product'
    });
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment
    },
    include: { user: true }
  });

  // Update product rating average
  await updateProductRating(productId);

  return res.status(201).json({
    success: true,
    data: review
  });
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.id;

  const existingReview = await prisma.review.findUnique({
    where: { id }
  });

  if (!existingReview) {
    return res.status(404).json({
      success: false,
      error: 'Review not found'
    });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this review'
    });
  }

  const review = await prisma.review.update({
    where: { id },
    data: { rating, comment },
    include: { user: true }
  });

  // Update product rating average
  await updateProductRating(existingReview.productId);

  return res.json({
    success: true,
    data: review
  });
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const existingReview = await prisma.review.findUnique({
    where: { id }
  });

  if (!existingReview) {
    return res.status(404).json({
      success: false,
      error: 'Review not found'
    });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this review'
    });
  }

  await prisma.review.delete({
    where: { id }
  });

  // Update product rating average
  await updateProductRating(existingReview.productId);

  return res.json({
    success: true,
    message: 'Review deleted successfully'
  });
};

// Helper function to update product rating average
async function updateProductRating(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId }
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: avgRating,
      reviewCount: reviews.length
    }
  });
}
