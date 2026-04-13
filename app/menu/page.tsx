"use client";
import React, { useState } from 'react';
import menuData from '@/data/menu.json';
import { Pizza } from '@/types';
import { PizzaCard } from '@/components/PizzaCard';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Appetizers', 'Classic Pizza', 'Signature Pizza', 'Desserts', 'Drinks'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredMenu: Pizza[] = menuData.filter((pizza) => {
    if (activeCategory === 'All') return true;
    return pizza.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight mb-4">
          Our Menu
        </h1>
        <p className="text-lg text-black/60 max-w-2xl mx-auto font-medium">
          Fresh ingredients, hot out of the oven.
        </p>
      </motion.div>

      {/* Categories Bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl py-4 mb-10 border-b border-black/5 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex overflow-x-auto gap-3 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'bg-black/5 text-black hover:bg-black/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredMenu.map((pizza, index) => (
          <PizzaCard key={pizza.id} pizza={pizza} index={index} />
        ))}
        {filteredMenu.length === 0 && (
          <div className="col-span-full py-20 text-center text-black/50 font-medium text-lg">
            No items found in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
