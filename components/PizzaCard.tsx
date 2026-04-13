"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pizza } from '@/types';
import { OrderButton } from './OrderButton';
import { useCart } from '@/hooks/useCart';
import { CYOModal } from './CYOModal';

interface PizzaCardProps {
  pizza: Pizza;
  index: number;
}

export function PizzaCard({ pizza, index }: PizzaCardProps) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = () => {
    if (pizza.isCustomizable) {
      setIsModalOpen(true);
    } else {
      addToCart({ pizza });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white rounded-none border border-black/10 flex flex-col group hover:border-black transition-colors duration-300"
      >
        <div className="relative h-56 w-full overflow-hidden bg-black/5 border-b border-black/10">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="text-xl font-black text-black leading-tight">{pizza.name}</h3>
            <span className="text-lg font-bold text-black border px-2 py-1">${pizza.basePrice.toFixed(2)}</span>
          </div>
          <p className="text-black/60 text-sm mb-6 flex-grow font-medium leading-relaxed">{pizza.description}</p>
          <OrderButton onClick={handleAction}>
            {pizza.isCustomizable ? 'Customize' : 'Add to Order'}
          </OrderButton>
        </div>
      </motion.div>

      {pizza.isCustomizable && (
        <CYOModal 
          pizza={pizza} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
