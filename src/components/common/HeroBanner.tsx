import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  ruTitle?: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  className?: string; 
}

export function HeroBanner({ 
  title, 
  ruTitle,
  description, 
  icon: Icon,
  gradient,
  className = ""
}: HeroBannerProps) {
  const bgClass = gradient 
    ? `bg-gradient-to-r ${gradient} shadow-md shadow-slate-900/10` 
    : (className || "bg-gradient-to-r from-[#1a5286] via-blue-600 to-indigo-700 shadow-md shadow-blue-950/10");

  return (
    <div className={`text-white rounded-2xl px-6 py-4 sm:py-5 flex items-center justify-between gap-5 mb-4 sm:mb-5 relative overflow-hidden border border-white/20 shadow-lg ${bgClass} ${gradient && className ? className : ''}`}>
      <div className="relative z-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-1 sm:mb-1.5">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide uppercase drop-shadow-xs">
            {title}
          </h1>
          {ruTitle && (
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white/95 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/30 shadow-2xs">
              {ruTitle}
            </span>
          )}
        </div>
        <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      
      {/* Icon trang trí bên phải */}
      <div className="relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md shrink-0 shadow-inner">
        <Icon size={26} strokeWidth={2.2} />
      </div>
      
      {/* Subtle overlay glow */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}