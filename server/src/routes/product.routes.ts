import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} from '../controllers/product.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);

// Protected admin routes
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.post('/categories', protect, admin, createCategory);

export default router;
