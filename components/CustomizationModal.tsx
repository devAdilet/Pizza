"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Pizza, SizeOption, CrustOption, ToppingSelection } from '@/types';
import { useCart } from '@/hooks/useCart';
import { OrderType } from '@/context/CartContext';
import { OrderButton } from './OrderButton';
import { Checkbox } from './ui/Checkbox';
import { SegmentedControl } from './ui/SegmentedControl';
import { calculateFinalPrice } from '@/utils/PriceCalculator';

const getToppingGroups = (category: string): Record<string, string[]> => {
  if (['Classic Pizzas', 'Signature Pizzas', 'Create Your Own Pizza', 'Calzones'].includes(category)) {
    return {
      Meats: ['Pepperoni', 'Sausage', 'Bacon', 'Ham', 'Chicken'],
      Veggies: ['Mushrooms', 'Onions', 'Green Peppers', 'Black Olives', 'Jalapeños'],
      Cheeses: ['Extra Mozzarella', 'Parmesan', 'Feta', 'Ricotta'],
      Sauces: ['Extra Tomato', 'BBQ', 'Garlic Parmesan', 'Hot Honey']
    };
  }
  if (category === 'Pastas') {
    return {
      AddOns: ['Extra Cheese', 'Meatballs', 'Grilled Chicken', 'Garlic Bread']
    };
  }
  if (['Hot Subs', 'Flat Breads'].includes(category)) {
    return {
      Extras: ['Extra Meat', 'Extra Cheese', 'Jalapeños', 'Side Marinara']
    };
  }
  return {};
};

interface CustomizationModalProps {
  pizza: Pizza;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationModal({ pizza, isOpen, onClose }: CustomizationModalProps) {
  const { addToCart, orderType, setOrderType } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(pizza.availableSizes?.[0]);
  const [selectedCrust, setSelectedCrust] = useState<CrustOption | undefined>(pizza.availableCrusts?.[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingSelection[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toppingGroups = getToppingGroups(pizza.category);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize(pizza.availableSizes?.[0]);
      setSelectedCrust(pizza.availableCrusts?.[0]);
      setSelectedToppings([]);
      setSpecialInstructions('');
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

  const currentTotal = calculateFinalPrice(pizza.basePrice, selectedSize, selectedCrust, selectedToppings);

  const handleAddToCart = () => {
    addToCart({
      pizza,
      selectedSize,
      selectedCrust,
      selectedToppings,
      specialInstructions,
      finalPrice: currentTotal
    });
    onClose();
  };

  const hasSizes = pizza.availableSizes && pizza.availableSizes.length > 0;
  const hasCrusts = pizza.availableCrusts && pizza.availableCrusts.length > 0;
  const hasToppings = Object.keys(toppingGroups).length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative bg-white w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col border border-black shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-black flex justify-between items-start bg-black text-white">
            <div className="pr-4">
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">{pizza.name}</h2>
              <p className="text-white/70 font-mono font-medium text-lg">Base Price: ${pizza.basePrice.toFixed(2)}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-white/70 transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 bg-white">
            
            {/* Size & Crust Grid */}
            {(hasSizes || hasCrusts) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {hasSizes && (
                  <div>
                    <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-6 pb-2 border-b border-black/10">1. Select Size</h3>
                    <div className="space-y-4">
                      {pizza.availableSizes!.map(size => (
                        <Checkbox 
                          key={size.label}
                          label={`${size.label} ${size.priceModifier > 0 ? `(+$${size.priceModifier.toFixed(2)})` : ''}`}
                          checked={selectedSize?.label === size.label}
                          onChange={() => setSelectedSize(size)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {hasCrusts && (
                  <div>
                    <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-6 pb-2 border-b border-black/10">2. Select Style</h3>
                    <div className="space-y-4">
                      {pizza.availableCrusts!.map(crust => (
                        <Checkbox 
                          key={crust.label}
                          label={`${crust.label} ${crust.priceModifier > 0 ? `(+$${crust.priceModifier.toFixed(2)})` : ''}`}
                          checked={selectedCrust?.label === crust.label}
                          onChange={() => setSelectedCrust(crust)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toppings Modules */}
            {hasToppings && (
              <div>
                 <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-8 pt-4 border-t border-black/10 pb-2">Customize Add-ons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {Object.entries(toppingGroups).map(([group, toppings]) => (
                    <div key={group}>
                      <h4 className="font-bold text-black mb-6 text-xl">{group}</h4>
                      <div className="flex flex-col gap-5">
                        {toppings.map(topping => {
                          const isSelected = selectedToppings.find(t => t.name === topping);
                          return (
                            <div key={topping} className="group flex flex-col gap-3">
                              <Checkbox 
                                label={`${topping} (+$1.50)`}
                                checked={!!isSelected}
                                onChange={() => toggleTopping(topping)}
                              />
                              
                              {isSelected && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pl-8 flex flex-wrap gap-2 overflow-hidden"
                                >
                                  {['Regular', 'Extra', 'Left Half', 'Right Half'].map(state => (
                                    <button
                                      key={state}
                                      onClick={() => updateToppingState(topping, state as ToppingSelection['state'])}
                                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-colors ${isSelected.state === state ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/20 hover:border-black'}`}
                                    >
                                      {state}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions Field */}
            <div className="pt-8 border-t border-black/10">
              <h3 className="text-sm font-black text-black/50 tracking-widest uppercase mb-4">Special Instructions</h3>
              <textarea 
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="Examples: well done, no olives, cut in squares..."
                className="w-full bg-black/5 p-4 font-medium text-black placeholder:text-black/40 border-b-2 border-black/20 focus:outline-none focus:border-black transition-colors resize-none min-h-[100px]"
              />
            </div>
          </div>

          {/* Footer (Delivery Toggle & Price) */}
          <div className="p-6 md:p-8 border-t-2 border-black bg-white flex flex-col gap-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-black uppercase tracking-widest text-black/50">Order Preference</span>
              <div className="w-full sm:w-64">
                <SegmentedControl 
                  options={['Delivery', 'Takeout']} 
                  selected={orderType} 
                  onChange={(val) => setOrderType(val as OrderType)} 
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4 border-t border-black/10">
              <div className="text-center sm:text-left w-full sm:w-auto flex flex-col">
                <span className="text-black/50 font-black uppercase tracking-widest text-xs mb-1">Final Setup Total</span>
                <span className="text-5xl font-mono font-black tracking-tighter">${currentTotal.toFixed(2)}</span>
              </div>
              <div className="w-full sm:w-1/2 max-w-sm">
                <OrderButton onClick={handleAddToCart}>
                  Add to Order
                </OrderButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
