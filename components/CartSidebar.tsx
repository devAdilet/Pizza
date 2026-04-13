"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { OrderButton } from './OrderButton';
import { useRouter } from 'next/navigation';

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-black hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-black/40">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-none object-cover border border-black/10" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-black leading-tight">{item.name}</h4>
                        <div className="text-[10px] uppercase tracking-wider text-black/50 my-1 font-bold">
                          {item.selectedSize?.label || 'Standard'} 
                          {item.selectedCrust ? ` • ${item.selectedCrust.label}` : ''}
                          {item.selectedToppings?.length ? ` • ${item.selectedToppings.length} Extras` : ''}
                        </div>
                        <p className="text-black font-mono font-black mt-2">${item.finalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border border-black/20 hover:border-black transition-colors text-black"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-black w-4 text-center text-black text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-black/20 hover:border-black transition-colors text-black"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-black/5">
                <div className="flex justify-between items-center mb-4 text-xl font-black text-black">
                  <span className="uppercase tracking-widest text-sm text-black/50">Subtotal</span>
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <OrderButton onClick={handleCheckout}>Go to Checkout</OrderButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
