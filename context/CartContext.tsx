'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  addToCart: (foodItemId: string, quantity?: number, forceClear?: boolean) => Promise<{ success: boolean; error?: string; errorType?: string }>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCartItems(data.cartItems || []);
        }
      }
    } catch (err) {
      console.error('Failed to load cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  // Totals calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryCharge = cartItems.length > 0 ? cartItems[0].foodItem.restaurant.deliveryFee : 0;
  const total = Math.round((subtotal + tax + deliveryCharge) * 100) / 100;

  const addToCart = async (foodItemId: string, quantity = 1, forceClear = false) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItemId, quantity, forceClear }),
      });

      const data = await res.json();

      if (res.status === 409 && data.error === 'RESTAURANT_MISMATCH') {
        return { success: false, error: data.message, errorType: 'RESTAURANT_MISMATCH' };
      }

      if (res.ok && data.success) {
        await refreshCart();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to add item' };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (err) {
      console.error('Failed to remove cart item:', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart?clear=true', {
        method: 'DELETE',
      });
      if (res.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        subtotal,
        tax,
        deliveryCharge,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
