"use client";
import { useState, useEffect } from 'react';
import { Pizza } from '@/types';
import menuDataRaw from '@/data/menu.json';

export function useAdminData() {
  const [items, setItems] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('menu_db_v1');
    if (raw && raw !== '[]') {
      setItems(JSON.parse(raw));
    } else {
      localStorage.setItem('menu_db_v1', JSON.stringify(menuDataRaw));
      setItems(menuDataRaw as Pizza[]);
    }
    setIsLoading(false);
  }, []);

  const saveItem = (item: Pizza) => {
    const isNew = !items.some(i => i.id === item.id);
    const updated = isNew ? [...items, item] : items.map(i => i.id === item.id ? item : i);
    setItems(updated);
    localStorage.setItem('menu_db_v1', JSON.stringify(updated));
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('menu_db_v1', JSON.stringify(updated));
  };

  return { items, isLoading, saveItem, deleteItem };
}
