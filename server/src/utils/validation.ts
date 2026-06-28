import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const googleAuthSchema = z.object({
  token: z.string().min(1, 'Google token is required')
});

// Product schemas
export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string().url()).optional()
});

export const updateProductSchema = createProductSchema.partial();

export const getProductSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1', 10)),
  limit: z.string().optional().transform(val => parseInt(val || '20', 10)),
  search: z.string().optional(),
  categoryId: z.string().optional()
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductQuery = z.infer<typeof getProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer').default(1)
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer')
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

// Address schemas
export const createAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

// Order schemas
export const createOrderSchema = z.object({
  cartItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1, 'Cart must not be empty'),
  addressId: z.string().min(1, 'Address ID is required'),
  paymentMethod: z.enum(['CARD', 'COD']).default('CARD')
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Confirm order schema
export const confirmOrderSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required')
});

export type ConfirmOrderInput = z.infer<typeof confirmOrderSchema>;

// Review schemas
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required')
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
