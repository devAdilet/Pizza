"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OrderButton } from '@/components/OrderButton';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-32 relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center z-10"
      >
        <span className="inline-block py-1 px-4 rounded-full bg-black text-white font-bold text-sm tracking-widest mb-6 uppercase shadow-sm">
          New Menu is Live
        </span>
        <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-8 leading-[1.05]">
          The <span className="underline decoration-4 underline-offset-8">Premium</span> <br className="hidden md:block"/> Pizza Experience.
        </h1>
        <p className="text-xl md:text-2xl text-black/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Crafted with passion, baked to perfection. Explore our new signature pizzas, appetizers, and desserts today.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <OrderButton onClick={() => router.push('/menu')} style={{ maxWidth: '280px', margin: '0 auto', fontSize: '1.125rem', padding: '1rem' }}>
            Get Started
          </OrderButton>
        </div>
      </motion.div>
    </div>
  );
}
