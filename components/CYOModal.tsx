"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Pizza, SizeOption, CrustOption, ToppingSelection } from '@/types';
import { useCart } from '@/hooks/useCart';
import { OrderButton } from './OrderButton';

const TOPPING_GROUPS = {
  Meats: ['Pepperoni', 'Sausage', 'Bacon', 'Ham', 'Chicken'],
  Veggies: ['Mushrooms', 'Onions', 'Green Peppers', 'Black Olives', 'Jalapeños'],
  Cheeses: ['Extra Mozzarella', 'Parmesan', 'Feta', 'Ricotta'],
  Sauces: ['Extra Tomato', 'BBQ', 'Garlic Parmesan', 'Hot Honey']
};

interface CYOModalProps {
  pizza: Pizza;
  isOpen: boolean;
  onClose: () => void;
}

export function CYOModal({ pizza, isOpen, onClose }: CYOModalProps) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(pizza.availableSizes?.[0]);
  const [selectedCrust, setSelectedCrust] = useState<CrustOption | undefined>(pizza.availableCrusts?.[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingSelection[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize(pizza.availableSizes?.[0]);
      setSelectedCrust(pizza.availableCrusts?.[0]);
      setSelectedToppings([]);
    }
  }, [isOpen, pizza]);

  if (!isOpen) return null;

  const toggleTopping = (name: string) => {
    setSelectedToppings(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.filter(t => t.name !== name);
      }
      return [...prev, { id: name.toLowerCase().replace(' ', '-'), name, state: 'Regular', priceModifier: 1.50 }];
    });
  };

  const updateToppingState = (name: string, state: ToppingSelection['state']) => {
    setSelectedToppings(prev => prev.map(t => t.name === name ? { ...t, state } : t));
  };

  const currentTotal = pizza.basePrice 
    + (selectedSize?.priceModifier || 0) 
    + (selectedCrust?.priceModifier || 0)
    + selectedToppings.reduce((acc, t) => acc + (t.state === 'Extra' ? t.priceModifier * 2 : t.priceModifier), 0);

  const handleAddToCart = () => {
    addToCart({
      pizza,
      selectedSize,
      selectedCrust,
      selectedToppings,
      finalPrice: currentTotal
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white w-full max-w-4xl h-[90vh] flex flex-col rounded-none shadow-2xl border border-black"
        >
          {/* Header */}
          <div className="p-6 border-b border-black flex justify-between items-center bg-black text-white">
            <h2 className="text-2xl font-black uppercase tracking-tight">{pizza.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-white">
            
            {/* Size & Crust Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-4">1. Select Size</h3>
                <div className="space-y-3">
                  {pizza.availableSizes?.map(size => (
                    <label key={size.label} className={`flex items-center justify-between p-4 cursor-pointer border ${selectedSize?.label === size.label ? 'border-black bg-black text-white' : 'border-black/20 bg-white hover:border-black'} transition-colors`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="size" 
                          className="hidden" 
                          checked={selectedSize?.label === size.label}
                          onChange={() => setSelectedSize(size)}
                        />
                        <span className="font-bold">{size.label}</span>
                      </div>
                      <span className="font-medium text-sm">{size.priceModifier > 0 ? `+$${size.priceModifier.toFixed(2)}` : 'Included'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-4">2. Select Crust</h3>
                <div className="space-y-3">
                  {pizza.availableCrusts?.map(crust => (
                    <label key={crust.label} className={`flex items-center justify-between p-4 cursor-pointer border ${selectedCrust?.label === crust.label ? 'border-black bg-black text-white' : 'border-black/20 bg-white hover:border-black'} transition-colors`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="crust" 
                          className="hidden" 
                          checked={selectedCrust?.label === crust.label}
                          onChange={() => setSelectedCrust(crust)}
                        />
                        <span className="font-bold">{crust.label}</span>
                      </div>
                      <span className="font-medium text-sm">{crust.priceModifier > 0 ? `+$${crust.priceModifier.toFixed(2)}` : 'Included'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Toppings Grid */}
            <div>
              <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-6 pt-10 border-t border-black/10">3. Choose Toppings</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {Object.entries(TOPPING_GROUPS).map(([group, toppings]) => (
                  <div key={group}>
                    <h4 className="font-black text-black mb-4 text-xl">{group}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {toppings.map(topping => {
                        const isSelected = selectedToppings.find(t => t.name === topping);
                        return (
                          <div key={topping} className={`p-4 border ${isSelected ? 'border-black bg-black/5' : 'border-black/20 bg-white hover:border-black/50'} transition-all`}>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 accent-black rounded-none"
                                checked={!!isSelected}
                                onChange={() => toggleTopping(topping)}
                              />
                              <span className="font-bold">{topping}</span>
                              <span className="ml-auto text-sm font-medium">{isSelected?.state === 'Extra' ? '+$3.00' : '+$1.50'}</span>
                            </label>
                            {isSelected && (
                              <div className="pl-8 pt-4 flex flex-wrap gap-2">
                                {['Regular', 'Extra', 'Left Half', 'Right Half'].map(state => (
                                  <button
                                    key={state}
                                    onClick={() => updateToppingState(topping, state as ToppingSelection['state'])}
                                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${isSelected.state === state ? 'bg-black text-white border-black' : 'bg-white text-black border-black/20 hover:border-black'}`}
                                  >
                                    {state}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Footer */}
          <div className="p-6 md:px-10 border-t border-black bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <p className="text-black/60 font-bold uppercase tracking-widest text-xs mb-1">Total Details</p>
              <p className="text-4xl font-black">${currentTotal.toFixed(2)}</p>
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <OrderButton onClick={handleAddToCart}>
                Confirm Selection
              </OrderButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
