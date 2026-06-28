import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createCheckoutSession,
  confirmOrder
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All order routes are protected
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/checkout', protect, createCheckoutSession);
router.post('/confirm', protect, confirmOrder);

export default router;
