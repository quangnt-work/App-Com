import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-xs border-t border-slate-100 py-2.5 text-center mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-slate-500">
        <p className="text-[11px] font-semibold text-slate-700">
          GIẢNG VIÊN: THƯỢNG ÚY PHẠM QUANG ANH · <span className="font-normal text-slate-500">BỘ MÔN NGOẠI NGỮ TIN HỌC, KHOA CƠ BẢN - CƠ SỞ</span>
        </p>
        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
          © {new Date().getFullYear()} RU·Learn Hub
        </p>
      </div>
    </footer>
  );
};