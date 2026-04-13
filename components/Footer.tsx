import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-[#424242]">
          
          {/* Logo & About */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex flex-col items-start">
              <span className="text-3xl font-black tracking-tight text-black leading-none uppercase">Magnolia</span>
              <span className="text-xs font-bold text-[#FF5722] tracking-[0.2em] uppercase mt-1">Pizza & Pasta</span>
            </Link>
            <p className="text-sm font-medium mt-2 leading-relaxed">
              Serving the best artisanal pizzas and pastas since 1999. Crafted with love, baked to perfection.
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-black font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF5722]" /> Address
            </h4>
            <div className="text-sm font-medium space-y-1">
              <p>2120 W. Emerson Pl.</p>
              <p>Seattle, WA 98199</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block mt-4 text-[#FF5722] hover:text-black font-bold uppercase tracking-wider text-xs border-b-2 border-[#FF5722] hover:border-black transition-colors pb-1">
                Get Directions
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-black font-black uppercase tracking-wider mb-6 flex items-center gap-2">
               Contact
            </h4>
            <div className="text-sm font-medium space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F5F5] rounded-full"><Phone className="w-4 h-4 text-[#FF5722]"/></div>
                <span>206-213-0333</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F5F5] rounded-full"><Mail className="w-4 h-4 text-[#FF5722]"/></div>
                <span>caksusm@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-black font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF5722]" /> Hours
            </h4>
            <div className="text-sm font-medium space-y-2">
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-[#424242]/70 font-bold uppercase text-xs">Mon - Thu:</span>
                <span>10am - 10pm</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-[#424242]/70 font-bold uppercase text-xs">Fri:</span>
                <span>10am - 12am</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-[#424242]/70 font-bold uppercase text-xs">Sat:</span>
                <span>11am - 12am</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-[#424242]/70 font-bold uppercase text-xs">Sun:</span>
                <span>11am - 10pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-black/5 pt-8 text-center text-xs font-bold uppercase tracking-widest text-[#424242]/30">
          © {new Date().getFullYear()} Magnolia Pizza & Pasta. Built with Next.js.
        </div>
      </div>
    </footer>
  );
}
