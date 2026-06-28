/**
 * Shared TypeScript types for Amazon Clone
 * Used by both client and server for end-to-end type safety
 */

// === Enums ===

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SELLER';

// === User Types ===

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithToken extends User {
  token: string;
}

// === Auth Types ===

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// === Category Types ===

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// === Product Types ===

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithPagination {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// === Cart Types ===

export interface CartItemSnapshot {
  id: string;
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItemSnapshot[];
  createdAt: string;
  updatedAt: string;
}

// === Order Types ===

export interface OrderItemSnapshot {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  paymentId?: string;
  items: OrderItemSnapshot[];
  address?: OrderAddress;
  createdAt: string;
  updatedAt: string;
}

// === Review Types ===

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number; // 1-5
  comment: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// === Wishlist Types ===

export interface WishlistItem {
  id: string;
  title: string;
  image?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
}

// === API Response Types ===

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
