"use client";
import React, { useState } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ProductModal } from '@/components/admin/ProductModal';
import { Pizza } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { items, isLoading, saveItem, deleteItem, seedDatabase } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pizza | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openNew = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (item: Pizza) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  if (isLoading) return <div>Loading menu data...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Menu Items</h2>
          <p className="text-[#424242]/70 font-medium">Manage your pizzas, pastas, and more in real-time.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {items.length === 0 && !isLoading && (
            <button 
              onClick={seedDatabase}
              className="flex items-center gap-2 bg-[#424242] text-white px-5 py-3 rounded-2xl font-bold hover:bg-black transition-colors shadow-md"
            >
              Seed DB
            </button>
          )}
          <button 
            onClick={openNew}
            className="flex items-center gap-2 bg-[#FF5722] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#E64A19] transition-colors shadow-md shadow-[#FF5722]/20"
          >
            <Plus className="w-5 h-5" /> New Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F5F5F5] text-xs uppercase tracking-widest text-[#424242]/50 font-black border-b border-black/5">
              <th className="p-4 pl-6">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                <td className="p-4 pl-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl overflow-hidden flex-shrink-0 border border-black/5">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-black leading-tight">{item.name}</p>
                    <p className="text-[11px] font-bold text-[#424242]/50 uppercase tracking-wide truncate max-w-[200px] mt-0.5">{item.description}</p>
                  </div>
                </td>
                <td className="p-4 font-bold text-[#424242] text-sm">{item.category}</td>
                <td className="p-4 font-mono font-black text-[#FF5722]">${item.basePrice.toFixed(2)}</td>
                <td className="p-4 text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 text-[#424242]/50 hover:bg-black/5 hover:text-black rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-[#424242]/50 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={saveItem}
        initialData={editingItem}
      />

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setItemToDelete(null)} 
            />
            <motion.div 
              initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.95, opacity: 0}} 
              className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl relative w-full max-w-sm text-center border border-black/5"
            >
              <h3 className="text-2xl font-black text-black mb-4">Delete Item?</h3>
              <p className="text-[#424242]/70 font-medium mb-8 leading-relaxed">
                Are you sure you want to delete this specific item? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setItemToDelete(null)} 
                  className="flex-1 py-4 px-4 font-bold text-[#424242] hover:bg-black/5 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 py-4 px-4 font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
