// src/components/features/CategoryCard.tsx
import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export const CategoryCard = ({ title, description, icon, href }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-xl">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      
      <div className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">
        {title}
      </div>
      
      <div className="w-12 h-0.5 bg-orange-200 mb-6"></div>
      
      <p className="text-slate-500 italic mb-8 text-sm">
        {description}
      </p>
      
      <Link 
        href={href}
        className="mt-auto w-full flex items-center justify-center bg-[#F4A460] hover:bg-[#E69138] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all uppercase tracking-widest text-sm"
      >
        Chi tiết
      </Link>
    </div>
  );
};