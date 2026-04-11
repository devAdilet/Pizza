"use client";

import React, { createContext, useState, useEffect } from 'react';
import { CartItem, Pizza } from '@/types';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (pizza: Pizza) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart JSON", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pizza_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (pizza: Pizza) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === pizza.id);
      if (existing) {
        return prev.map((item) =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (pizzaId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === pizzaId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
