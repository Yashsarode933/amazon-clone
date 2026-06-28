import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItemSnapshot } from '@shared/index';
import api, { cartAPI } from '../api/client';

interface CartState {
  items: CartItemSnapshot[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await cartAPI.get();
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { productId: string; quantity: number }) => {
    const response = await cartAPI.add(data);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (data: { cartItemId: string; quantity: number }) => {
    const response = await cartAPI.update(data.cartItemId, data.quantity);
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string) => {
    await cartAPI.remove(cartItemId);
    return cartItemId;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    await cartAPI.clear();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (Number(item.price || 0) * item.quantity),
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(
          item => (item as any).productId === (action.payload as any).productId
        );

        if (existingItem) {
          existingItem.quantity += (action.payload as any).quantity;
        } else {
          state.items.push(action.payload as CartItemSnapshot);
        }

        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (Number(item.price || 0) * item.quantity),
          0
        );
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === (action.payload as any).id);
        if (item) {
          item.quantity = (action.payload as any).quantity;
        }
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (Number(item.price || 0) * item.quantity),
          0
        );
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (Number(item.price || 0) * item.quantity),
          0
        );
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  }
});

export default cartSlice.reducer;
