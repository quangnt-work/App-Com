import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  // Cho phép ghi đè class nếu cần thiết (ví dụ: đổi màu nền)
  className?: string; 
}

export function HeroBanner({ 
  title, 
  description, 
  icon: Icon,
  className = "bg-[#f07b32]" // Mặc định là màu cam của brand
}: HeroBannerProps) {
  return (
    <div className={`text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-12 shadow-sm relative overflow-hidden ${className}`}>
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase mb-4">
          {title}
        </h1>
        <p className="text-white/90 text-sm md:text-base font-medium">
          {description}
        </p>
      </div>
      
      {/* Icon trang trí bên phải */}
      <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white/10 backdrop-blur-sm">
        <Icon size={48} strokeWidth={2.5} />
      </div>
      
      {/* Background pattern/overlay (tùy chọn để banner đẹp hơn) */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}