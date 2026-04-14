"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth_v1');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname && !pathname.includes('/login')) {
         router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = (email: string, pass: string) => {
    if (email === 'admin@magnolia.com' && pass === 'magnolia123!') {
      localStorage.setItem('admin_auth_v1', 'true');
      setIsAuthenticated(true);
      router.push('/admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_auth_v1');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return { isAuthenticated, isLoading, login, logout };
}
