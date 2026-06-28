import { Router } from 'express';
import {
  adminGetOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes are protected and require admin role
router.get('/orders', protect, admin, adminGetOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/stats', protect, admin, getDashboardStats);

export default router;
