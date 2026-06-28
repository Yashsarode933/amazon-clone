import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All cart routes are protected
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);
router.delete('/', protect, clearCart);

export default router;
