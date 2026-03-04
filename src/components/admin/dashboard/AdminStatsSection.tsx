// src/components/admin/dashboard/AdminStatsSection.tsx
import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, CheckSquare, Folder } from 'lucide-react';
import { DashboardStatsType } from '@/types/admin';

interface Props {
  stats: DashboardStatsType;
}

export function AdminStatsSection({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
      
      {/* Card 1: Tổng học viên */}
      <Link 
        href="/admin/students" // Sửa lại đường dẫn này theo cấu trúc thư mục của bạn
        className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-gray-600 font-semibold text-lg">Tổng học viên</h3>
          <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl">
            <Users size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-gray-800">
            {stats.totalStudents.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-green-600 text-sm font-medium flex items-center gap-1">
          ↗ +12% tháng này
        </div>
      </Link>

      {/* Card 2: Tổng bài học */}
      <Link 
        href="/admin/lessons" // Sửa lại đường dẫn này theo cấu trúc thư mục của bạn
        className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-gray-600 font-semibold text-lg">Tổng bài học</h3>
          <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl">
            <BookOpen size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-gray-800">
            {stats.totalGrammars.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-gray-500 text-sm space-y-2">
          <p className="flex items-center gap-2">📄 Ngữ pháp: 45</p>
          <p className="flex items-center gap-2">▶️ Video: 30</p>
          <p className="flex items-center gap-2">🎧 Audio: 50</p>
        </div>
      </Link>

      {/* Card 3: Tổng đề thi */}
      <Link 
        href="/admin/exams" // Sửa lại đường dẫn này theo cấu trúc thư mục của bạn
        className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-gray-600 font-semibold text-lg">Tổng đề thi</h3>
          <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl">
            <CheckSquare size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-gray-800">
            {stats.totalPractice.toLocaleString()}
          </span>
        </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-gray-500 text-sm mt-auto pt-6">
            <p className="flex items-center gap-2">🎧 Nghe: 10</p>
            <p className="flex items-center gap-2">📖 Đọc hiểu: 15</p>
            <p className="flex items-center gap-2">📝 Ngữ pháp: 20</p>
            <p className="flex items-center gap-2">🔤 Từ vựng: 15</p>
          </div>
      </Link>

      {/* Card 4: Tài liệu */}
      <Link 
        href="/admin/documents" // Sửa lại đường dẫn này theo cấu trúc thư mục của bạn
        className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-gray-600 font-semibold text-lg">Tài liệu</h3>
          <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl">
            <Folder size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-gray-800">
            {stats.totalResources.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 w-full">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-[#ea580c] h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-gray-500">Đã dùng 4.5 GB / 10 GB</p>
        </div>
      </Link>

    </div>
  );
}