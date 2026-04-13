"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Flame } from 'lucide-react';
import { Pizza } from '@/types';
import { OrderButton } from './OrderButton';
import { useCart } from '@/hooks/useCart';
import { CustomizationModal } from './CustomizationModal';
import { isCustomizable } from '@/utils/CategoryGuard';

interface PizzaCardProps {
  pizza: Pizza;
  index: number;
}

export function PizzaCard({ pizza, index }: PizzaCardProps) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customizable = isCustomizable(pizza.category);

  const handleAction = () => {
    if (customizable) {
      setIsModalOpen(true);
    } else {
      addToCart({ pizza });
    }
  };

  const kcal = pizza.kcal || Math.floor(Math.random() * (800 - 300) + 300);
  const rating = pizza.rating || (Math.random() * (5 - 4.2) + 4.2).toFixed(1);
  const prepTime = pizza.prepTime || "15-20 min";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white rounded-[2rem] border border-black/5 shadow-md shadow-black/5 flex flex-col group hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        <div className="relative h-60 w-full overflow-hidden bg-[#F5F5F5]">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-[#424242]/70 text-xs font-bold uppercase tracking-wider mb-5">
            <div className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-[#FF5722]" /> {kcal} Kcal</div>
            <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500/50" /> {rating}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {prepTime}</div>
          </div>
          
          {/* Title & Price */}
          <div className="flex justify-between items-start mb-3 gap-4">
            <h3 className="text-2xl font-black text-black leading-tight">{pizza.name}</h3>
            <span className="text-2xl font-mono font-black text-[#FF5722] whitespace-nowrap">${pizza.basePrice.toFixed(2)}</span>
          </div>
          
          <p className="text-[#424242]/80 text-sm mb-8 flex-grow font-medium leading-relaxed">{pizza.description}</p>
          
          <OrderButton onClick={handleAction}>
            {customizable ? 'Customize' : 'Add to Order'}
          </OrderButton>
        </div>
      </motion.div>

      {customizable && (
        <CustomizationModal 
          pizza={pizza} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
