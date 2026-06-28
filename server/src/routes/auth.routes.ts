import { Router } from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

// Protected routes
router.get('/me', protect, getMe);

export default router;
