"use client";
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">
              PIZZA<span className="text-red-600">.</span>CO
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-black hover:text-red-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
