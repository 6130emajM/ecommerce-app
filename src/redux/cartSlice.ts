import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadFromSession = (): CartItem[] => {
  try {
    const data = sessionStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToSession = (items: CartItem[]) => {
  sessionStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: loadFromSession(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveToSession(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveToSession(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
