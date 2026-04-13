import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-[#F5F5F5] p-1.5 rounded-full border border-black/5 relative">
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`relative flex-1 text-center py-2.5 px-4 rounded-full font-bold text-sm tracking-wide transition-colors z-10 ${
            selected === option ? 'text-white' : 'text-[#424242] hover:text-black'
          }`}
        >
          {selected === option && (
            <motion.div
              layoutId="seg-bg-global"
              className="absolute inset-0 bg-[#FF5722] rounded-full shadow-md shadow-[#FF5722]/20"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ zIndex: -1 }}
            />
          )}
          {option}
        </button>
      ))}
    </div>
  );
}
