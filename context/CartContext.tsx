"use client";

import React, { createContext, useState, useEffect } from 'react';
import { CartItem, AddToCartPayload } from '@/types';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (payload: AddToCartPayload) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Extremely simple hashing function for UI consistency
const generateCartItemId = (payload: AddToCartPayload): string => {
  const { pizza, selectedSize, selectedCrust, selectedToppings } = payload;
  let hashParts = [pizza.id];
  if (selectedSize) hashParts.push(`sz-${selectedSize.label}`);
  if (selectedCrust) hashParts.push(`cr-${selectedCrust.label}`);
  if (selectedToppings && selectedToppings.length > 0) {
    const toppingsStr = selectedToppings
      .filter((t) => t.state !== 'None')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => `${t.id}=${t.state}`)
      .join('|');
    if (toppingsStr) hashParts.push(`top-${toppingsStr}`);
  }
  return hashParts.join('::');
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('pizza_cart_v3');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart JSON", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pizza_cart_v3', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (payload: AddToCartPayload) => {
    const cartItemId = generateCartItemId(payload);
    const finalPrice = payload.finalPrice ?? payload.pizza.basePrice;
    const addQty = payload.quantity ?? 1;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + addQty } : item
        );
      }
      return [
        ...prev,
        {
          ...payload.pizza,
          cartItemId,
          quantity: addQty,
          finalPrice,
          selectedSize: payload.selectedSize,
          selectedCrust: payload.selectedCrust,
          selectedToppings: payload.selectedToppings,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
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
