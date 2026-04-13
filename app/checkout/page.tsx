"use client";
import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { OrderButton } from '@/components/OrderButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const deliveryFee = 4.99;
  const total = cartTotal + (cartTotal > 0 ? deliveryFee : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    // Mock processing delay
    setTimeout(() => {
      setStatus('success');
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && status === 'idle') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/menu')} className="text-red-600 font-bold hover:underline">
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => router.push('/menu')}
        className="flex items-center gap-2 font-bold mb-8 text-black/60 hover:text-black transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Menu
      </button>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <CheckCircle2 className="w-24 h-24 mx-auto text-black mb-6" />
            <h1 className="text-5xl font-extrabold mb-4 text-black">Order Confirmed!</h1>
            <p className="text-xl text-black/60 mb-8 font-medium">Your pizza is on the way. We will contact you soon.</p>
            <OrderButton onClick={() => router.push('/menu')} style={{ maxWidth: '300px', margin: '0 auto' }}>
              Back to Menu
            </OrderButton>
          </motion.div>
        ) : (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Form Section */}
            <div>
              <h2 className="text-4xl font-extrabold mb-8 text-black">Checkout</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Delivery Address</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                    placeholder="123 Pizza Street, Apt 4B"
                  />
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-black/5 p-8 rounded-3xl h-fit">
              <h3 className="text-2xl font-bold mb-6 text-black">Order Summary</h3>
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex flex-col font-medium border-b border-black/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="text-black font-bold">{item.quantity}x {item.name}</span>
                      <span className="text-black font-black">${(item.finalPrice * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.selectedSize && (
                      <div className="text-xs text-black/50 mt-1 uppercase tracking-widest">
                        {item.selectedSize.label} 
                        {item.selectedCrust ? ` • ${item.selectedCrust.label}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-black/10 pt-4 mb-4 space-y-2">
                <div className="flex justify-between font-medium text-black/60">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-black/60">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4 mb-8">
                <div className="flex justify-between text-xl font-bold text-black">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <OrderButton 
                onClick={handleSubmit} 
                disabled={status === 'processing' || cart.length === 0}
              >
                {status === 'processing' ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </OrderButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
