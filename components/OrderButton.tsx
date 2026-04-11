"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface OrderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function OrderButton({ children, ...props }: OrderButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(255,0,0,0.39)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
