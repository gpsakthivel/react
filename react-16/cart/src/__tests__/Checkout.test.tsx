import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Checkout from '../pages/Checkout';
import type { Product } from '../types';

const product: Product = {
  id: 1,
  name: 'Test Item',
  description: 'desc',
  price: 25.0,
  image: 'https://placehold.co/300x200',
  category: 'Electronics',
};

function renderCheckout() {
  // Pre-populate cart via localStorage so CartProvider loads with items
  localStorage.setItem('cart_items', JSON.stringify([{ product, quantity: 1 }]));
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CartProvider>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/order-confirmation" element={<div>Confirmed!</div>} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

function fillForm(overrides: Record<string, string> = {}) {
  const defaults: Record<string, string> = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    address: '123 Main St',
    city: 'Springfield',
    postalCode: '12345',
    country: 'USA',
  };
  const data = { ...defaults, ...overrides };
  Object.entries(data).forEach(([name, value]) => {
    const el = document.getElementById(name) as HTMLInputElement;
    if (el) fireEvent.change(el, { target: { value } });
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Checkout', () => {
  it('renders shipping form fields', () => {
    renderCheckout();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Street Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('Postal Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('shows order summary with items', () => {
    renderCheckout();
    expect(screen.getByText(/Test Item/)).toBeInTheDocument();
    expect(screen.getAllByText('$25.00').length).toBeGreaterThan(0);
  });

  it('shows validation errors on empty submit', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('shows email format validation error', () => {
    renderCheckout();
    fillForm({ email: 'not-an-email' });
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('shows postal code format validation error', () => {
    renderCheckout();
    fillForm({ postalCode: 'abc' });
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Enter a valid postal code.')).toBeInTheDocument();
  });

  it('clears field error when user starts typing', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    fireEvent.change(document.getElementById('fullName')!, {
      target: { value: 'Alice' },
    });
    expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
  });

  it('navigates to order confirmation on successful submit', async () => {
    renderCheckout();
    fillForm();
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Placing Order\u2026')).toBeInTheDocument();
    await act(async () => {
      vi.runAllTimers();
    });
    expect(screen.getByText('Confirmed!')).toBeInTheDocument();
  });
});
