"use client";
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. (Try admin@magnolia.com / magnolia123!)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-black/5 w-full max-w-md border border-black/5">
        <h1 className="text-3xl font-black text-black mb-2 tracking-tight text-center">Admin Portal</h1>
        <p className="text-center text-[#424242]/70 font-medium mb-10 text-sm">Sign in to manage your menu</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#F5F5F5] font-medium text-black placeholder:text-black/30 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all border border-transparent"
              placeholder="admin@magnolia.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#F5F5F5] font-medium text-black placeholder:text-black/30 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 transition-all border border-transparent"
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-[#FF5722] text-white font-bold rounded-2xl shadow-lg shadow-[#FF5722]/30 hover:bg-[#E64A19] transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
