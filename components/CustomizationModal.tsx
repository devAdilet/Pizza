"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Pizza, SizeOption, CrustOption, ToppingSelection } from '@/types';
import { useCart } from '@/hooks/useCart';
import { OrderType } from '@/context/CartContext';
import { OrderButton } from './OrderButton';
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#F5F5F5] w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 md:px-10 md:py-8 bg-white border-b border-black/5 flex justify-between items-center z-10 shadow-sm relative">
            <div className="pr-4">
              <h2 className="text-3xl font-black text-black tracking-tight leading-none mb-2">{pizza.name}</h2>
              <p className="text-[#FF5722] font-mono font-bold text-lg">${pizza.basePrice.toFixed(2)} Base</p>
            </div>
            <button onClick={onClose} className="p-3 bg-[#F5F5F5] text-[#424242] hover:bg-black/5 hover:text-black rounded-full transition-colors flex-shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
            
            {/* Size & Crust Grid using SegmentedControls instead of checkboxes */}
            {(hasSizes || hasCrusts) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-black/5">
                {hasSizes && (
                  <div>
                    <h3 className="text-sm font-bold text-[#424242] uppercase tracking-wider mb-4">Size</h3>
                    <SegmentedControl 
                      name="size-control"
                      options={pizza.availableSizes!.map(s => s.label)}
                      selected={selectedSize?.label || ''}
                      onChange={(val) => {
                        const s = pizza.availableSizes!.find(x => x.label === val);
                        if(s) setSelectedSize(s);
                      }}
                    />
                    {selectedSize && selectedSize.priceModifier > 0 && (
                      <p className="text-[#FF5722] font-mono text-xs font-bold mt-2 ml-2">+{selectedSize.priceModifier.toFixed(2)}</p>
                    )}
                  </div>
                )}

                {hasCrusts && (
                  <div>
                    <h3 className="text-sm font-bold text-[#424242] uppercase tracking-wider mb-4">Crust Style</h3>
                    <SegmentedControl 
                      name="crust-control"
                      options={pizza.availableCrusts!.map(c => c.label)}
                      selected={selectedCrust?.label || ''}
                      onChange={(val) => {
                        const c = pizza.availableCrusts!.find(x => x.label === val);
                        if(c) setSelectedCrust(c);
                      }}
                    />
                    {selectedCrust && selectedCrust.priceModifier > 0 && (
                      <p className="text-[#FF5722] font-mono text-xs font-bold mt-2 ml-2">+{selectedCrust.priceModifier.toFixed(2)}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Toppings Modules - Card Grid Style */}
            {hasToppings && (
              <div>
                <div className="grid grid-cols-1 gap-12">
                  {Object.entries(toppingGroups).map(([group, toppings]) => (
                    <div key={group}>
                      <h4 className="font-black text-black mb-6 text-2xl">{group}</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {toppings.map(topping => {
                          const isSelected = selectedToppings.find(t => t.name === topping);
                          const active = !!isSelected;
                          return (
                            <div 
                              key={topping} 
                              className={`flex flex-col overflow-hidden bg-white rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${active ? 'border-[#FF5722]' : 'border-transparent hover:border-[#FF5722]/30'}`}
                            >
                              <div className="p-4 flex-grow flex items-center justify-between gap-2" onClick={() => toggleTopping(topping)}>
                                <span className={`font-bold leading-tight ${active ? 'text-[#FF5722]' : 'text-[#424242]'}`}>{topping}</span>
                                <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-[#FF5722] bg-[#FF5722]' : 'border-[#424242]/30'}`}>
                                  {active && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                              </div>
                              
                              <AnimatePresence>
                                {active && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-[#FF5722]/5 p-3 border-t border-[#FF5722]/20 flex flex-wrap gap-2"
                                  >
                                    {['Regular', 'Extra', 'Left Half', 'Right Half'].map(state => (
                                      <button
                                        key={state}
                                        onClick={(e) => { e.stopPropagation(); updateToppingState(topping, state as ToppingSelection['state']); }}
                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full transition-colors ${isSelected.state === state ? 'bg-[#FF5722] text-white shadow-sm' : 'bg-white text-[#424242] border border-black/5 hover:border-[#FF5722]'}`}
                                      >
                                        {state}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
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
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-black/5">
              <h3 className="text-sm font-bold text-[#424242] uppercase tracking-wider mb-4">Special Instructions</h3>
              <textarea 
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="Examples: well done, no olives, cut in squares..."
                className="w-full bg-[#F5F5F5] rounded-2xl p-4 font-medium text-black placeholder:text-black/40 border border-transparent focus:outline-none focus:border-[#FF5722] transition-colors resize-none h-28"
              />
            </div>
            
          </div>

          {/* Footer (Delivery Toggle & Price) */}
          <div className="p-6 md:px-10 md:py-8 bg-white border-t border-black/5 flex flex-col gap-6 flex-shrink-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-[#424242]/70">Order Preference</span>
              <div className="w-full sm:w-64">
                <SegmentedControl 
                  name="order-type-control"
                  options={['Delivery', 'Takeout']} 
                  selected={orderType} 
                  onChange={(val) => setOrderType(val as OrderType)} 
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
              <div className="text-center sm:text-left w-full sm:w-auto flex flex-col">
                <span className="text-[#424242]/50 font-bold uppercase tracking-wide text-xs mb-1">Total Configuration</span>
                <span className="text-4xl font-mono font-black text-black tracking-tighter">${currentTotal.toFixed(2)}</span>
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
