import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import productsReducer from './productSlice';
import cartReducer from './cartSlice';

// Auth reducer
const authReducer = (
  state = { user: null as null | { id: string; email: string; name: string; role: string }, token: localStorage.getItem('token') },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case 'auth/loginSuccess':
      return { user: action.payload.user, token: action.payload.token };
    case 'auth/logout':
      return { user: null, token: null };
    default:
      return state;
  }
};

const rootReducer = {
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer
};

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector<RootState>;
