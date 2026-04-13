"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface OrderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function OrderButton({ children, className = "", ...props }: OrderButtonProps & { className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      className={`w-full py-3.5 px-6 bg-[#FF5722] text-white font-bold rounded-full shadow-lg shadow-[#FF5722]/30 hover:bg-[#E64A19] hover:shadow-[#FF5722]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
