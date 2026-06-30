import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../redux/cartSlice';
import ProductsPage from './ProductsPage';

// Mock Firebase so tests don't hit a real database
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('../firebaseConfig', () => ({
  db: {},
}));

import { getDocs } from 'firebase/firestore';

const mockProduct = {
  id: '1',
  title: 'Sneakers',
  price: 49.99,
  category: 'Shoes',
  description: 'Comfy sneakers',
  image: 'sneakers.png',
};

const renderWithStore = () => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  return { store, ...render(<Provider store={store}><ProductsPage /></Provider>) };
};

beforeEach(() => {
  (getDocs as jest.Mock).mockResolvedValue({
    docs: [{ id: '1', data: () => mockProduct }],
  });
});

// Unit test: renders product data fetched from Firestore
test('renders product list after fetching', async () => {
  renderWithStore();
  expect(await screen.findByText('Sneakers')).toBeInTheDocument();
  expect(screen.getByText('Shoes')).toBeInTheDocument();
  expect(screen.getByText('$49.99')).toBeInTheDocument();
});

// Integration test: clicking "Add to Cart" updates Redux cart state
test('clicking Add to Cart updates the cart in the store', async () => {
  const { store } = renderWithStore();

  await screen.findByText('Sneakers');

  fireEvent.click(screen.getByText('Add to Cart'));

  await waitFor(() => {
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].title).toBe('Sneakers');
  });
});