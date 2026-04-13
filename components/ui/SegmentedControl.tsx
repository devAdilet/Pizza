import React from 'react';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-black/5 p-1">
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 text-center py-2 px-4 transition-all duration-200 font-bold text-sm tracking-wider uppercase ${selected === option ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
