import { Request, Response } from 'express';
import prisma from '../prisma/client';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  createCategorySchema
} from '../utils/validation';

// @desc    Get all products with pagination, search, and category filter
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  const validation = getProductSchema.safeParse(req.query);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { page, limit, search, categoryId } = validation.data;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return res.json({
    success: true,
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  return res.json({
    success: true,
    data: product
  });
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req: Request, res: Response) => {
  const validation = createProductSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { title, description, price, stock, categoryId, images } = validation.data;

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    return res.status(400).json({
      success: false,
      error: 'Category not found'
    });
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price,
      stock,
      categoryId,
      images: images || []
    },
    include: { category: true }
  });

  return res.status(201).json({
    success: true,
    data: product
  });
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validation = updateProductSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: validation.data,
    include: { category: true }
  });

  return res.json({
    success: true,
    data: product
  });
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  await prisma.product.delete({
    where: { id }
  });

  return res.json({
    success: true,
    message: 'Product deleted successfully'
  });
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return res.json({
    success: true,
    data: categories
  });
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req: Request, res: Response) => {
  const validation = createCategorySchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors[0].message
    });
  }

  const { name, slug } = validation.data;

  // Check if slug exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    return res.status(400).json({
      success: false,
      error: 'Category with this slug already exists'
    });
  }

  const category = await prisma.category.create({
    data: { name, slug }
  });

  return res.status(201).json({
    success: true,
    data: category
  });
};
