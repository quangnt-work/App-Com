import React from 'react';
import { Globe, HelpCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-extrabold text-slate-800 mb-1 tracking-tight">
          GIẢNG VIÊN THƯỢNG ÚY PHẠM QUANG ANH
        </h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">
          BỘ MÔN NGOẠI NGỮ TIN HỌC, KHOA CƠ BẢN - CƠ SỞ
        </p>

        <div className="flex justify-center gap-8 text-slate-300 mb-8">
          <Globe className="hover:text-blue-600 cursor-pointer transition-colors" size={24} />
          <HelpCircle className="hover:text-blue-600 cursor-pointer transition-colors" size={24} />
          <Shield className="hover:text-blue-600 cursor-pointer transition-colors" size={24} />
        </div>

        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} Russian Learning Hub
        </p>
      </div>
    </footer>
  );
};