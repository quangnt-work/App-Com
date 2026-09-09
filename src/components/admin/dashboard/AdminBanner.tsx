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
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md mb-8 border border-slate-800">

      <div className="flex items-center gap-4">
        <Settings size={40} className="text-indigo-400 opacity-90" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">
          Quản trị hệ thống
        </h2>
      </div>

      <div className="mt-4 md:mt-0 text-right opacity-90 text-sm md:text-base">
        <p className="text-slate-300">Hệ thống quản lý học tập (LMS)</p>
        <p className="text-slate-400 text-xs mt-0.5">Phiên bản 2.1.0</p>
        <span className="text-slate-300 text-xs"> 📅 {today}</span>
      </div>
    </div>
  );
}