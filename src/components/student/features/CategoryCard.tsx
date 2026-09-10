// src/components/features/CategoryCard.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  colorScheme?: 'blue' | 'indigo' | 'orange' | 'teal';
}

export const CategoryCard = ({ 
  title, 
  description, 
  icon, 
  href,
  colorScheme = 'blue'
}: CategoryCardProps) => {
  const styles = {
    blue: {
      border: 'hover:border-blue-200 hover:shadow-blue-900/5',
      icon: 'bg-blue-50 text-blue-600',
      btn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-blue-500/30'
    },
    indigo: {
      border: 'hover:border-indigo-200 hover:shadow-indigo-900/5',
      icon: 'bg-indigo-50 text-indigo-600',
      btn: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20 hover:shadow-indigo-500/30'
    },
    orange: {
      border: 'hover:border-amber-200 hover:shadow-orange-900/5',
      icon: 'bg-amber-50 text-amber-600',
      btn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20 hover:shadow-orange-500/30'
    },
    teal: {
      border: 'hover:border-emerald-200 hover:shadow-emerald-900/5',
      icon: 'bg-emerald-50 text-emerald-600',
      btn: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/30'
    }
  }[colorScheme];

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-md shadow-slate-200/50 border border-slate-200/80 ${styles.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full`}>
      {/* Icon */}
      <div className={`w-12 h-12 ${styles.icon} rounded-xl flex items-center justify-center mb-3 shadow-inner`}>
        {icon}
      </div>

      {/* Nội dung */}
      <h3 className="font-extrabold text-slate-900 text-base mb-1">
        {title}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
        {description}
      </p>

      {/* Nút Bắt đầu */}
      <Link 
        href={href}
        className={`w-full py-2.5 px-4 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs ${styles.btn} hover:shadow-md transition-all mt-auto`}
      >
        Bắt đầu
      </Link>
    </div>
  );
};