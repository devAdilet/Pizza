import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, checked, onChange, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`relative w-5 h-5 flex flex-shrink-0 items-center justify-center border transition-all duration-200 ${checked ? 'bg-black border-black text-white' : 'bg-white border-black/20 group-hover:border-black'}`}>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
          className="opacity-0 absolute inset-0 cursor-pointer" 
          {...props} 
        />
        {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </div>
      <span className="font-bold select-none">{label}</span>
    </label>
  );
}
