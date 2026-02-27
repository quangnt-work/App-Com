// src/components/layout/footer.tsx
import React from 'react';
import { Globe, HelpCircle, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 border-t py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          GIẢNG VIÊN THƯỢNG ÚY PHẠM QUANG ANH
        </h3>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-8">
          BỘ MÔN NGOẠI NGỮ TIN HỌC, KHOA CƠ BẢN - CƠ SỞ
        </p>
        
        <div className="flex justify-center items-center gap-6 mb-8 text-slate-400">
          <Globe className="cursor-pointer hover:text-blue-600 transition-colors" size={24} />
          <HelpCircle className="cursor-pointer hover:text-blue-600 transition-colors" size={24} />
          <ShieldCheck className="cursor-pointer hover:text-blue-600 transition-colors" size={24} />
        </div>

        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Russian Learning Hub • All Rights Reserved
        </p>
      </div>
    </footer>
  );
};