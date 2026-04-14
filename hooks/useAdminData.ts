"use client";
import { useState, useEffect } from 'react';
import { Pizza } from '@/types';
import menuDataRaw from '@/data/menu.json';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';

export function useAdminData() {
  const [items, setItems] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, 'menuItems');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Pizza);
      setItems(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveItem = async (item: Pizza) => {
    try {
      await setDoc(doc(db, 'menuItems', item.id), item);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save to Firebase. Check console for permissions.");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const seedDatabase = async () => {
    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      const rawPizzas = menuDataRaw as Pizza[];
      for (const item of rawPizzas) {
        const itemRef = doc(db, 'menuItems', item.id);
        batch.set(itemRef, item);
      }
      await batch.commit();
    } catch (error) {
      console.error("Seed error: ", error);
      alert("Seed failed. Make sure Firestore rules allow writes.");
    } finally {
      setIsLoading(false);
    }
  };

  return { items, isLoading, saveItem, deleteItem, seedDatabase };
}
