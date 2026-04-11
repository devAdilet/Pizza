"use client";
import React, { useState } from 'react';
import menuData from '@/data/menu.json';
import { Pizza } from '@/types';
import { PizzaCard } from '@/components/PizzaCard';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Meat', 'Veggie', 'Spicy'];

export default function Home() {
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
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-black tracking-tight mb-6 mt-8">
          The <span className="text-red-600">Perfect</span> Slice.
        </h1>
        <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
          Premium ingredients, modern flavors, delivered hot.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-black text-white shadow-lg scale-105'
                : 'bg-black/5 text-black hover:bg-black/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Pizza Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredMenu.map((pizza, index) => (
          <PizzaCard key={pizza.id} pizza={pizza} index={index} />
        ))}
      </div>
    </div>
  );
}
