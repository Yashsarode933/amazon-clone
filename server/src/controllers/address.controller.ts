import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createAddressSchema,
  updateAddressSchema
} from '../utils/validation';

// @desc    Get user's addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  });

  return res.json({
    success: true,
    data: addresses
  });
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
export const getAddressById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const address = await prisma.address.findUnique({
    where: { id }
  });

  if (!address || address.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Address not found'
    });
  }

  return res.json({
    success: true,
    data: address
  });
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req: AuthenticatedRequest, res: Response) => {
  const validation = createAddressSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { fullName, addressLine1, addressLine2, city, state, postalCode, country } = validation.data;
  const userId = req.user!.id;

  // If this is set as default, unset other defaults
  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault: req.body.isDefault || false
    }
  });

  return res.status(201).json({
    success: true,
    data: address
  });
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const validation = updateAddressSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const userId = req.user!.id;

  const existingAddress = await prisma.address.findUnique({
    where: { id }
  });

  if (!existingAddress || existingAddress.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Address not found'
    });
  }

  // If this is set as default, unset other defaults
  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: id } },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: validation.data
  });

  return res.json({
    success: true,
    data: address
  });
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const existingAddress = await prisma.address.findUnique({
    where: { id }
  });

  if (!existingAddress || existingAddress.userId !== userId) {
    return res.status(404).json({
      success: false,
      error: 'Address not found'
    });
  }

  await prisma.address.delete({
    where: { id }
  });

  return res.json({
    success: true,
    message: 'Address deleted successfully'
  });
};
