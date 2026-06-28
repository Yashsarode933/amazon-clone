import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All wishlist routes are protected
router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:id', protect, removeFromWishlist);

export default router;
