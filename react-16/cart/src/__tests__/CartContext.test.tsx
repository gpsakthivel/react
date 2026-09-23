import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import type { Product } from '../types';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'A test product',
  price: 10.0,
  image: 'https://placehold.co/300x200',
  category: 'Electronics',
};

const mockProduct2: Product = {
  id: 2,
  name: 'Second Product',
  description: 'Another product',
  price: 20.0,
  image: 'https://placehold.co/300x200',
  category: 'Sports',
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('throws when used outside CartProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );
    consoleSpy.mockRestore();
  });

  it('adds a product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('increments quantity when same product is added again', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('calculates totalItems correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    expect(result.current.totalItems).toBe(3);
  });

  it('calculates totalPrice correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    expect(result.current.totalPrice).toBeCloseTo(10 * 2 + 20, 2);
  });

  it('removes an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct2));
    act(() => result.current.removeFromCart(1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(2);
  });

  it('updateQuantity changes the quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.updateQuantity(1, 5));
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('updateQuantity ignores quantity < 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.updateQuantity(1, 0));
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    const stored = JSON.parse(localStorage.getItem('cart_items') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe(1);
  });

  it('loads cart from localStorage on mount', () => {
    localStorage.setItem(
      'cart_items',
      JSON.stringify([{ product: mockProduct, quantity: 3 }])
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('cart_items', 'not-json');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
  });
});
