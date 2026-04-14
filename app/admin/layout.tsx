"use client";
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2, LayoutDashboard, Pizza, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF5722]" />
      </div>
    );
  }

  // Hide the shell for the login page
  if (!isAuthenticated || pathname?.includes('/login')) {
    return <div className="bg-[#F5F5F5] min-h-screen text-[#424242]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-[#F5F5F5] text-[#424242] max-w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col py-8 shadow-sm relative z-10 hidden md:flex flex-shrink-0">
        <h1 className="text-2xl font-black text-black mb-12 tracking-tight text-center">
          MAGNOLIA<span className="text-[#FF5722]">.ADMIN</span>
        </h1>
        
        <nav className="flex-1 w-full px-4 space-y-2">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${pathname === '/admin' ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20' : 'hover:bg-black/5 text-[#424242]'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/menu" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold hover:bg-black/5 text-[#424242] transition-colors mt-4 border-t border-black/5 pt-4">
            <Pizza className="w-5 h-5" /> View Public Site
          </Link>
        </nav>

        <div className="w-full px-4 mt-auto">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 text-[#424242] transition-colors">
             <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto w-full relative">
        {children}
      </main>
    </div>
  );
}
