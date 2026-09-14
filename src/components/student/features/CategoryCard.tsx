// src/components/features/CategoryCard.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  ruTitle?: string;
  description: string;
  icon: ReactNode;
  href: string;
  colorScheme?: 'blue' | 'indigo' | 'orange' | 'teal' | 'purple';
  buttonLabel?: string;
  compact?: boolean;
}

export const CategoryCard = ({ 
  title, 
  ruTitle,
  description, 
  icon, 
  href, 
  colorScheme = 'blue',
  buttonLabel = 'Bắt đầu',
  compact = false
}: CategoryCardProps) => {
  const styles = {
    blue: {
      border: 'hover:border-blue-300 hover:shadow-blue-500/10',
      icon: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      btn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-blue-500/30'
    },
    indigo: {
      border: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
      icon: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
      btn: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20 hover:shadow-indigo-500/30'
    },
    orange: {
      border: 'hover:border-amber-300 hover:shadow-orange-500/10',
      icon: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
      btn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20 hover:shadow-orange-500/30'
    },
    teal: {
      border: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
      icon: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
      btn: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/30'
    },
    purple: {
      border: 'hover:border-purple-300 hover:shadow-purple-500/10',
      icon: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
      btn: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-purple-500/20 hover:shadow-purple-500/30'
    }
  }[colorScheme];

  return (
    <div className={`group bg-white/90 backdrop-blur-xl rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-center relative overflow-hidden h-full ${
      compact 
        ? 'p-3.5 sm:p-4 min-h-[195px] sm:min-h-[210px]' 
        : 'p-5 sm:p-6 min-h-[310px] sm:min-h-[330px]'
    } ${styles.border}`}>
      {/* Icon */}
      <div className={`rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105 shadow-2xs ${
        compact 
          ? 'w-11 h-11 sm:w-12 sm:h-12 mb-2 sm:mb-2.5' 
          : 'w-14 h-14 sm:w-16 sm:h-16 mb-3.5'
      } ${styles.icon}`}>
        {icon}
      </div>

      {/* Title & Russian Subtitle */}
      <h2 className={`font-black text-slate-900 tracking-tight mb-0.5 ${
        compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
      }`}>
        {title}
      </h2>
      {ruTitle && (
        <p className={`font-extrabold text-slate-400/90 tracking-[0.2em] uppercase ${
          compact ? 'text-[9px] sm:text-[10px] mb-1 sm:mb-1.5' : 'text-[10px] sm:text-[11px] mb-2'
        }`}>
          {ruTitle}
        </p>
      )}
      <p className={`text-slate-500 leading-relaxed font-medium flex-1 ${
        compact 
          ? 'text-[11px] sm:text-xs mb-3 min-h-[30px] line-clamp-2' 
          : 'text-xs sm:text-[13px] mb-5 min-h-[38px]'
      }`}>
        {description}
      </p>

      {/* Action Button */}
      <Link 
        href={href}
        className={`mt-auto w-full flex items-center justify-center text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all uppercase tracking-wider text-xs ${
          compact ? 'py-2 sm:py-2.5' : 'py-3 sm:py-3.5'
        } ${styles.btn}`}
      >
        {buttonLabel}
      </Link>
    </div>
  );
};