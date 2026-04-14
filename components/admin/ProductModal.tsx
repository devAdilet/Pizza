"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Pizza } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Pizza) => void;
  initialData?: Pizza;
}

const CATEGORIES = [
  'Appetizers', 'Salads', 'Low Carb', 'Pastas', 'Calzones', 'Hot Subs', 'Flat Breads', 
  'Create Your Own Pizza', 'Classic Pizzas', 'Signature Pizzas', 'Specialty Pizzas', 
  'Desserts', 'Beverages'
];

export function ProductModal({ isOpen, onClose, onSave, initialData }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Pizza> & { basePriceRaw?: string | number }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, basePriceRaw: initialData.basePrice });
    } else {
      setFormData({
        name: '', description: '', category: CATEGORIES[0], basePrice: 0, basePriceRaw: '',
        imageUrl: '', kcal: 500, rating: 4.5, prepTime: '15-20 min'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToSave = {
      ...formData,
      id: formData.id || `item-${Date.now()}`,
      basePrice: Number(formData.basePriceRaw) || 0,
      kcal: Number(formData.kcal) || 0,
      rating: Number(formData.rating) || 0,
    } as Pizza;
    
    onSave(itemToSave);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#F5F5F5]">
            <h2 className="text-2xl font-black text-black">{initialData ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={onClose} className="p-2 text-[#424242]/50 hover:bg-black/5 hover:text-black rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Product Name</label>
                <input 
                  type="text" required
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#F5F5F5] font-bold text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl transition-colors" 
                  placeholder="e.g. Margherita"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Category</label>
                <select 
                  value={formData.category || CATEGORIES[0]}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#F5F5F5] font-bold text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Description</label>
              <textarea 
                required
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#F5F5F5] font-medium text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl resize-none h-24" 
                placeholder="Delicious description..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Image URL</label>
              <div className="flex items-center gap-4">
                {formData.imageUrl && (
                  <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex-shrink-0 overflow-hidden border border-black/5">
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview"/>
                  </div>
                )}
                <input 
                  type="url" required
                  value={formData.imageUrl || ''} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="flex-1 bg-[#F5F5F5] font-medium text-sm text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl" 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-black/5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF5722]">Base Price ($)</label>
                <input 
                  type="number" step="0.01" required
                  value={formData.basePriceRaw ?? ''} 
                  onChange={e => setFormData({...formData, basePriceRaw: e.target.value === '' ? '' : Number(e.target.value)})}
                  className="w-full bg-[#FF5722]/10 text-[#FF5722] font-mono font-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Kcal</label>
                <input 
                  type="number" 
                  value={formData.kcal || ''} 
                  onChange={e => setFormData({...formData, kcal: Number(e.target.value)})}
                  className="w-full bg-[#F5F5F5] font-mono text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Rating</label>
                <input 
                  type="number" step="0.1" max="5" min="1"
                  value={formData.rating || ''} 
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full bg-[#F5F5F5] font-mono text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#424242]">Prep Time</label>
                <input 
                  type="text" 
                  value={formData.prepTime || ''} 
                  onChange={e => setFormData({...formData, prepTime: e.target.value})}
                  className="w-full bg-[#F5F5F5] font-medium text-black border border-transparent focus:border-[#FF5722] focus:outline-none p-3 rounded-xl" 
                  placeholder="e.g. 15-20 min"
                />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full py-4 bg-[#FF5722] text-white font-bold rounded-xl shadow-lg shadow-[#FF5722]/20 hover:bg-[#E64A19] transition-colors">
                Save Product
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
