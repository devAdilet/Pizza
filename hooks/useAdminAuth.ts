"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (pathname && !pathname.includes('/login')) {
           router.push('/admin/login');
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/admin');
      return true;
    } catch (error) {
      console.error("Firebase Login Error:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return { isAuthenticated, isLoading, login, logout };
}
