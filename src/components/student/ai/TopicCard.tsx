// src/components/student/ai/TopicCard.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface TopicCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  borderColor: string;
  iconColor: string;
  iconBgColor: string;
  href: string;
}

export function TopicCard({
  title,
  subtitle,
  icon,
  borderColor,
  iconColor,
  iconBgColor,
  href
}: TopicCardProps) {
  return (
    <Link 
      href={href}
      className={`group flex items-center p-4 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 border-l-[6px] ${borderColor}`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center mr-4 ${iconBgColor} ${iconColor}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[17px] font-bold text-gray-800 group-hover:text-black transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-gray-400 mt-0.5 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Arrow Icon */}
      <div className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all">
        <ChevronRight size={20} strokeWidth={2.5} />
      </div>
    </Link>
  );
}