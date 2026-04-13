"use client";
import React from 'react';
import { ShoppingCart, Menu, Phone } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Contacts / Menu */}
          <div className="flex-1 flex items-center justify-start">
            <button className="md:hidden p-2 text-[#424242] hover:bg-black/5 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-[#424242] cursor-pointer hover:text-black transition-colors font-bold text-sm tracking-wide">
              <div className="bg-[#F5F5F5] p-2 rounded-full"><Phone className="w-4 h-4 text-[#FF5722]" /></div>
              <span>Contacts</span>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center items-center cursor-pointer">
            <Link href="/" className="flex flex-col items-center">
              <span className="text-2xl font-black tracking-tight text-black leading-none uppercase">Magnolia</span>
              <span className="text-[10px] font-bold text-[#424242]/60 tracking-[0.2em] uppercase mt-1">Pizza & Pasta</span>
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex-1 flex items-center justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-[#F5F5F5] text-[#424242] hover:bg-[#FF5722] hover:text-white rounded-full transition-all duration-300 group shadow-sm hover:shadow"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-black leading-none text-white bg-[#FF5722] border-2 border-white rounded-full shadow-sm group-hover:border-[#FF5722] transition-colors">
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
