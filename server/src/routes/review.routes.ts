import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public route
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
