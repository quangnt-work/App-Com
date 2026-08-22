import React from 'react';
import { Settings } from 'lucide-react';

export function AdminBanner() {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return (
    <div className="bg-[#ea580c] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md mb-8">

      <div className="flex items-center gap-4">
        <Settings size={40} className="opacity-90" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">
          Quản trị hệ thống
        </h2>
      </div>

      <div className="mt-4 md:mt-0 text-right opacity-90 text-sm md:text-base">
        <p>Hệ thống quản lý học tập (LMS)</p>
        <p>Phiên bản 2.1.0</p>
        <span> 📅 {today}</span>
      </div>
    </div>
  );
}