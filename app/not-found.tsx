import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#F5F5F5] overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-black text-[#424242] mb-12">
        Oops! Page not found...
      </h2>
      
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-16">
        <span className="text-[140px] md:text-[250px] font-black text-black leading-none drop-shadow-md">
          4
        </span>
        
        {/* Pizza "0" container */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 relative flex-shrink-0 animate-[spin_40s_linear_infinite] shadow-2xl rounded-full border-[8px] border-white">
          <img 
            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80" 
            alt="Pizza Zero"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        <span className="text-[140px] md:text-[250px] font-black text-black leading-none drop-shadow-md">
          4
        </span>
      </div>

      <Link 
        href="/menu"
        className="px-10 py-5 bg-[#FF5722] text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-[#FF5722]/30 hover:bg-[#E64A19] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF5722]/40 transition-all duration-300"
      >
        Back to Menu
      </Link>
    </div>
  );
}
