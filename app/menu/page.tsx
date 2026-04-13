"use client";
import React, { useState, useEffect } from 'react';
import menuDataRaw from '@/data/menu.json';
import { Pizza } from '@/types';
import { PizzaCard } from '@/components/PizzaCard';

const CATEGORIES = [
  'Appetizers', 'Salads', 'Low Carb', 'Pastas', 'Calzones', 'Hot Subs', 'Flat Breads', 
  'Create Your Own Pizza', 'Classic Pizzas', 'Signature Pizzas', 'Specialty Pizzas', 
  'Desserts', 'Beverages'
];

const menuData = menuDataRaw as Pizza[];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`section-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentActive = activeCategory;
      for (const cat of CATEGORIES) {
        const el = document.getElementById(`section-${cat}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Adjust threshold based on layout
          if (rect.top >= 0 && rect.top < 300) {
            currentActive = cat;
            break;
          }
        }
      }
      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 flex-shrink-0 relative">
        <nav className="md:sticky md:top-24 flex flex-col bg-white border border-black p-4 space-y-1">
          <h2 className="text-xs font-black tracking-widest text-black/50 uppercase mb-4 px-3">Categories</h2>
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const isCyo = category === 'Create Your Own Pizza';
            return (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`text-left px-4 py-3 text-sm font-bold transition-all border ${
                  isActive 
                    ? 'bg-black text-white border-black delay-0' 
                    : isCyo 
                      ? 'bg-white hover:bg-black hover:text-white border-black/20 hover:border-black' 
                      : 'bg-white hover:bg-black/5 border-transparent text-black'
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        {CATEGORIES.map((category) => {
          const items = menuData.filter(item => item.category === category);
          if (items.length === 0) return null; // We can return null to completely hide empty sections.
          
          return (
            <div key={category} id={`section-${category}`} className="mb-20 scroll-mt-24">
              <h2 className="text-4xl font-black text-black mb-10 pb-4 border-b-2 border-black tracking-tight">
                {category}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {items.map((item, index) => (
                  <PizzaCard key={item.id} pizza={item} index={index} />
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
