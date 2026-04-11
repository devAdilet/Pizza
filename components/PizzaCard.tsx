"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Pizza } from '@/types';
import { OrderButton } from './OrderButton';
import { useCart } from '@/hooks/useCart';

interface PizzaCardProps {
  pizza: Pizza;
  index: number;
}

export function PizzaCard({ pizza, index }: PizzaCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-black/5 flex flex-col group hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 w-full overflow-hidden bg-black/5">
        <img
          src={pizza.imageUrl}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-black">{pizza.name}</h3>
          <span className="text-lg font-bold text-black">${pizza.price.toFixed(2)}</span>
        </div>
        <p className="text-black/60 text-sm mb-6 flex-grow">{pizza.description}</p>
        <OrderButton onClick={() => addToCart(pizza)}>Add to Cart</OrderButton>
      </div>
    </motion.div>
  );
}
