import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Định nghĩa Type an toàn cho props của Component
export interface LessonCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  href: string;
}

export default function LessonCard({ title, count, icon: Icon, href }: LessonCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
      {/* Icon Container */}
      <div className="w-20 h-20 bg-orange-50 text-[#ea580c] rounded-full flex items-center justify-center mb-6">
        <Icon size={36} strokeWidth={2} />
      </div>

      {/* Thông tin */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8">Số lượng: {count} bài</p>

      {/* Nút điều hướng */}
      <Link 
        href={href}
        className="mt-auto w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
      >
        Quản lý ngay <ArrowRight size={18} />
      </Link>
    </div>
  );
}