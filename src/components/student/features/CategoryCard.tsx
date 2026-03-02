// src/components/features/CategoryCard.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export const CategoryCard = ({ title, description, icon, href }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-orange-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Icon */}
      <div className="w-16 h-16 bg-[#fff2ea] text-[#f07b32] rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>

      {/* Nội dung */}
      <h3 className="font-bold text-gray-900 text-xl mb-3">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
        {description}
      </p>

      {/* Nút Bắt đầu */}
      <Link 
        href={href}
        className="w-full py-3 px-6 bg-[#f07b32] text-white font-bold rounded-xl hover:bg-[#d96b27] transition-colors mt-auto"
      >
        Bắt đầu
      </Link>
    </div>
  );
};