import axios from 'axios';
import { Product } from '@shared/index';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) =>
    api.get('/products', { params }),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  getByCategory: (categoryId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/products?categoryId=${categoryId}`, { params })
};

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),

  googleAuth: (token: string) =>
    api.post('/auth/google', { token }),

  getMe: () =>
    api.get('/auth/me')
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data: { productId: string; quantity: number }) =>
    api.post('/cart', data),
  update: (cartItemId: string, quantity: number) =>
    api.put(`/cart/${cartItemId}`, { quantity }),
  remove: (cartItemId: string) =>
    api.delete(`/cart/${cartItemId}`),
  clear: () => api.delete('/cart')
};

// Address API
export const addressesAPI = {
  getAll: () => api.get('/addresses'),
  getById: (id: string) => api.get(`/addresses/${id}`),
  create: (data: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }) => api.post('/addresses', data),
  update: (id: string, data: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  }) => api.put(`/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/addresses/${id}`)
};

// Order API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: {
    cartItems: { productId: string; quantity: number; price: number }[];
    addressId: string;
    paymentMethod?: 'CARD' | 'COD';
  }) => api.post('/orders', data),
  createCheckout: () => api.post('/orders/checkout'),
  confirm: (sessionId: string) => api.post('/orders/confirm', { sessionId })
};

// Review API
export const reviewsAPI = {
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  create: (data: { productId: string; rating: number; comment: string }) =>
    api.post('/reviews', data),
  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`)
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId: string) => api.post('/wishlist', { productId }),
  remove: (id: string) => api.delete(`/wishlist/${id}`)
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/admin/orders/${orderId}/status`, { status })
};

export default api;
