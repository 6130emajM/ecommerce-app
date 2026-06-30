import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../redux/cartSlice';
import Cart from './Cart';

const renderWithProviders = (preloadedState: any) => {
  const store = configureStore({
    reducer: { cart: cartReducer } as any,
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>
  );
};

test('shows empty cart message when there are no items', () => {
  renderWithProviders({ cart: { items: [] } });
  expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
});

test('renders cart items and removes one on click', () => {
  const mockItem = {
    id: 1,
    title: 'Sneakers',
    price: 49.99,
    image: 'sneakers.png',
    quantity: 1,
  };

  renderWithProviders({ cart: { items: [mockItem] } });

  expect(screen.getByText('Sneakers')).toBeInTheDocument();
  expect(screen.getByText('Total Items: 1')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Remove'));

  expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
});