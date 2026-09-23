import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductListing from '../pages/ProductListing';
import { products } from '../data/products';

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductListing />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('ProductListing', () => {
  it('renders the page heading', () => {
    renderWithProviders();
    expect(screen.getByText('Our Products')).toBeInTheDocument();
  });

  it('renders all products by default', () => {
    renderWithProviders();
    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it('filters products by category', () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Electronics' }));
    const electronics = products.filter((p) => p.category === 'Electronics');
    const nonElectronics = products.filter((p) => p.category !== 'Electronics');
    electronics.forEach((p) => expect(screen.getByText(p.name)).toBeInTheDocument());
    nonElectronics.forEach((p) =>
      expect(screen.queryByText(p.name)).not.toBeInTheDocument()
    );
  });

  it('shows all products when All filter is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Electronics' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    products.forEach((p) => expect(screen.getByText(p.name)).toBeInTheDocument());
  });

  it('filters products by search term', () => {
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText('Search products…'), {
      target: { value: 'Keyboard' },
    });
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no matches', () => {
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText('Search products…'), {
      target: { value: 'xyznonexistent' },
    });
    expect(screen.getByText('No products match your search.')).toBeInTheDocument();
  });

  it('adds a product to cart on button click', () => {
    renderWithProviders();
    const addBtns = screen.getAllByRole('button', { name: /add .+ to cart/i });
    fireEvent.click(addBtns[0]);
    expect(addBtns[0]).toHaveTextContent(/in cart/i);
  });
});
