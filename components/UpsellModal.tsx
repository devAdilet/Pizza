"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { OrderButton } from './OrderButton';
import menuDataRaw from '@/data/menu.json';
import { Pizza } from '@/types';
import { usePathname } from 'next/navigation';

const menuData = menuDataRaw as Pizza[];

// Tiramisu id is des-1 as checked in menu.json
const DESSERT_UPSELL = menuData.find(item => item.id === 'des-1')!;

export function UpsellModal() {
  const { isUpsellOpen, setIsUpsellOpen, addToCart, setIsCartOpen } = useCart();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  if (!DESSERT_UPSELL) return null; // Sanity check if data changes

  const handleAccept = () => {
    // Add dessert to cart but bypass upsell check
    addToCart({ pizza: DESSERT_UPSELL });
    setIsUpsellOpen(false);
    // addToCart already calls setIsCartOpen or setIsUpsellOpen. 
    // Since dessert category is bypassed, addToCart will call setIsCartOpen(true).
  };

  const handleDecline = () => {
    setIsUpsellOpen(false);
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isUpsellOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleDecline}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden text-center p-8 border border-black/5"
          >
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 p-2 text-[#424242]/40 hover:text-black hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-24 h-24 mx-auto bg-[#F5F5F5] rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
              <img src={DESSERT_UPSELL.imageUrl} alt="Tiramisu" className="w-full h-full object-cover" />
            </div>

            <h2 className="text-2xl font-black text-black leading-tight mb-2">Want something sweet?</h2>
            <p className="text-[#424242] font-medium text-sm mb-8">
              Add our famous <b>{DESSERT_UPSELL.name}</b> for just <span className="text-[#FF5722] font-mono font-bold">${DESSERT_UPSELL.basePrice.toFixed(2)}</span>.
            </p>

            <div className="flex flex-col gap-3">
              <OrderButton onClick={handleAccept}>
                Yes, add Tiramisu
              </OrderButton>
              <button 
                onClick={handleDecline}
                className="py-3 px-6 text-[#424242] font-bold rounded-full hover:bg-black/5 transition-colors text-sm"
              >
                No thanks, view cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
