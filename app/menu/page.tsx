"use client";
import React, { useState, useEffect, useRef } from 'react';
import menuDataRaw from '@/data/menu.json';
import { Pizza } from '@/types';
import { PizzaCard } from '@/components/PizzaCard';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Appetizers', 'Salads', 'Low Carb', 'Pastas', 'Calzones', 'Hot Subs', 'Flat Breads', 
  'Create Your Own Pizza', 'Classic Pizzas', 'Signature Pizzas', 'Specialty Pizzas', 
  'Desserts', 'Beverages'
];

const menuDataRawArray = menuDataRaw as Pizza[];

export default function MenuPage() {
  const [menuData, setMenuData] = useState<Pizza[]>(menuDataRawArray);
  const activeCategories = CATEGORIES.filter(cat => menuData.some(item => item.category === cat));
  const [activeCategory, setActiveCategory] = useState(activeCategories[0] || CATEGORIES[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScollingRef = useRef(false);

  useEffect(() => {
    const local = localStorage.getItem('menu_db_v1');
    if (local && local !== '[]') {
      const parsed = JSON.parse(local);
      setMenuData(parsed);
    }
  }, []);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
    isScollingRef.current = true;
    
    const element = document.getElementById(`section-${category}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Unblock spy after animation
      setTimeout(() => {
        isScollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScollingRef.current) return;
      
      let currentActive = activeCategory;
      for (const cat of activeCategories) {
        const el = document.getElementById(`section-${cat}`);
        if (el) {
          const rect = el.getBoundingClientRect();
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-10">
      
      {/* Mobile Category Dropdown */}
      <div className="md:hidden sticky top-[84px] z-40 bg-[#F5F5F5] py-2">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-black/5 font-bold text-[#424242]"
        >
          <span>{activeCategory}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-black/5 max-h-80 overflow-y-auto z-50 flex flex-col p-2"
            >
              {activeCategories.map(category => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                    activeCategory === category ? 'bg-[#FF5722] text-white' : 'text-[#424242] hover:bg-black/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:block w-72 flex-shrink-0 relative">
        <nav className="sticky top-28 flex flex-col bg-white rounded-3xl shadow-sm border border-black/5 p-4 space-y-1">
          <h2 className="text-xs font-black tracking-widest text-[#424242]/50 uppercase mb-4 px-4 pt-2">Menu</h2>
          {activeCategories.map((category) => {
            const isActive = activeCategory === category;
            const isCyo = category === 'Create Your Own Pizza';
            return (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20' 
                    : isCyo 
                      ? 'bg-orange-50 text-[#FF5722] hover:bg-orange-100' 
                      : 'bg-transparent hover:bg-black/5 text-[#424242]'
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
        {activeCategories.map((category) => {
          const items = menuData.filter(item => item.category === category);
          if (items.length === 0) return null;
          
          return (
            <div key={category} id={`section-${category}`} className="mb-20 scroll-mt-28">
              <h2 className="text-3xl font-black text-black mb-8 px-2 tracking-tight">
                {category}
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
