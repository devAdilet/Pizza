"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface OrderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function OrderButton({ children, ...props }: OrderButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 px-4 bg-black text-white font-bold rounded-none border border-black hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
