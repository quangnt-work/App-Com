import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  // Cho phép ghi đè class nếu cần thiết (ví dụ: đổi màu nền)
  className?: string; 
}

export function HeroBanner({ 
  title, 
  description, 
  icon: Icon,
  gradient,
  className = ""
}: HeroBannerProps) {
  const bgClass = gradient 
    ? `bg-gradient-to-r ${gradient} shadow-md shadow-slate-900/5` 
    : (className || "bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-md shadow-blue-900/10");

  return (
    <div className={`text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 mb-4 sm:mb-5 relative overflow-hidden ${bgClass} ${gradient && className ? className : ''}`}>
      <div className="relative z-10 max-w-xl">
        <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-wide uppercase mb-1">
          {title}
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium line-clamp-2 sm:line-clamp-none">
          {description}
        </p>
      </div>
      
      {/* Icon trang trí bên phải */}
      <div className="relative z-10 hidden sm:flex items-center justify-center w-11 h-11 md:w-13 md:h-13 rounded-xl border border-white/20 bg-white/15 backdrop-blur-xs shrink-0 shadow-inner">
        <Icon size={24} strokeWidth={2.2} />
      </div>
      
      {/* Background pattern/overlay */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}