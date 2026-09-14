import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2 sm:py-2.5 text-center mt-auto shadow-xs">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-1.5">
        {/* Banner chức danh & chủ nhiệm đề tài trang trọng */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1 rounded-xl bg-gradient-to-r from-[#1a5286] to-[#1e3a8a] text-white shadow-2xs border border-blue-400/30">
          <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase">
            CHỦ NHIỆM ĐỀ TÀI: THƯỢNG ÚY PHẠM QUANG ANH
          </span>
          <span className="hidden sm:inline text-blue-300 font-light">|</span>
          <span className="text-[11px] sm:text-xs font-medium text-blue-100/90">
            BỘ MÔN NGOẠI NGỮ TIN HỌC · KHOA CƠ BẢN - CƠ SỞ
          </span>
        </div>

        {/* Thông tin đơn vị và bản quyền */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-slate-500 font-semibold tracking-wide">
          <span>TRƯỜNG CAO ĐẲNG KỸ THUẬT PHÒNG KHÔNG - KHÔNG QUÂN</span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="text-slate-400 font-normal">© {new Date().getFullYear()} RU·Learn Hub. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};