"use client";

import React, { createContext, useState, useEffect } from 'react';
import { CartItem, AddToCartPayload } from '@/types';

export type OrderType = 'Delivery' | 'Takeout';

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
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  isUpsellOpen: boolean;
  setIsUpsellOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Extremely simple hashing function for UI consistency
const generateCartItemId = (payload: AddToCartPayload): string => {
  const { pizza, selectedSize, selectedCrust, selectedToppings, specialInstructions } = payload;
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
  if (specialInstructions && specialInstructions.trim() !== '') {
    // encode to keep it safe for a key string
    hashParts.push(`instr-${Buffer.from(specialInstructions).toString('base64').substring(0, 10)}`);
  }
  return hashParts.join('::');
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('pizza_cart_v3');
    const savedOrderType = localStorage.getItem('pizza_ordertype');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart JSON", e);
      }
    }
    if (savedOrderType) setOrderType(savedOrderType as OrderType);
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pizza_cart_v3', JSON.stringify(cart));
      localStorage.setItem('pizza_ordertype', orderType);
    }
  }, [cart, orderType, isInitialized]);

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
          specialInstructions: payload.specialInstructions,
        },
      ];
    });

    if (!['Desserts', 'Beverages'].includes(payload.pizza.category)) {
      setIsUpsellOpen(true);
    } else {
      setIsCartOpen(true);
    }
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
        orderType,
        setOrderType,
        isUpsellOpen,
        setIsUpsellOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
