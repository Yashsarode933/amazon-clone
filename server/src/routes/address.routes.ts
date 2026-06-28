import { Router } from 'express';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/address.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All address routes are protected
router.get('/', protect, getAddresses);
router.get('/:id', protect, getAddressById);
router.post('/', protect, createAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

export default router;
