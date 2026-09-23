import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import CartPage from '../pages/CartPage';
import type { Product } from '../types';

const productA: Product = {
  id: 1,
  name: 'Widget A',
  description: 'desc',
  price: 15.0,
  image: 'https://placehold.co/300x200',
  category: 'Electronics',
};

function Seeder({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button onClick={() => addToCart(product)} data-testid="seed">
      Seed
    </button>
  );
}

function renderWithProviders(preload = true) {
  return render(
    <MemoryRouter initialEntries={['/cart']}>
      <CartProvider>
        {preload && <Seeder product={productA} />}
        <CartPage />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('CartPage', () => {
  it('shows empty state when cart is empty', () => {
    renderWithProviders(false);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('displays cart items when cart has products', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    expect(screen.getByText('Widget A')).toBeInTheDocument();
  });

  it('shows item subtotal correctly', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    // multiple elements may show $15.00 (subtotal, order total, etc.)
    expect(screen.getAllByText('$15.00').length).toBeGreaterThan(0);
  });

  it('removes an item when remove button is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    fireEvent.click(screen.getByRole('button', { name: /remove widget a from cart/i }));
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('clears cart when clear button is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('increases quantity when + button is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrease button is disabled at quantity 1', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    const decreaseBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    expect(decreaseBtn).toBeDisabled();
  });

  it('shows proceed to checkout button', () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('seed'));
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });
});
