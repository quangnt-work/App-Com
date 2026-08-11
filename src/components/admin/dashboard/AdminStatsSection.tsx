// src/components/admin/dashboard/AdminStatsSection.tsx
import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, CheckSquare, Folder, Sparkles } from 'lucide-react';
import { DashboardStatsType } from '@/types/admin';

interface Props {
  stats: DashboardStatsType;
}

export function AdminStatsSection({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 items-stretch">

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
          <p className="flex items-center gap-2">📄 Ngữ pháp: {stats.grammarFileCount}</p>
          <p className="flex items-center gap-2">▶️ Video: {stats.videoCount}</p>
          <p className="flex items-center gap-2">🎧 Audio: {stats.audioCount}</p>
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
            {stats.totalExams.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-gray-500 text-sm space-y-2">
          <p className="flex items-center gap-2">🔗 Tổng hợp: {stats.examMixedCount}</p>
          <p className="flex items-center gap-2">📝 Ngữ pháp: {stats.examGrammarCount}</p>
          <p className="flex items-center gap-2">📖 Đọc hiểu: {stats.examReadingCount}</p>
          <p className="flex items-center gap-2">🎧 Nghe: {stats.examListeningCount}</p>
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
            {stats.totalDocuments.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-gray-500 text-sm space-y-1">
          <p className="flex items-center gap-2">📄 Tổng tài liệu số: {stats.totalDocuments}</p>
        </div>
      </Link>

      {/* Card 5: AI Shadowing */}
      <Link
        href="/admin/shadowing"
        className="block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-300"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-gray-800 font-bold text-lg">AI Shadowing</h3>
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
            <Sparkles size={24} />
          </div>
        </div>
        <div>
          <span className="text-2xl font-extrabold text-blue-900 bg-clip-text">
            Tạo bài học
          </span>
        </div>
        <div className="mt-auto pt-4 text-blue-600/80 text-sm font-medium">
          <p className="leading-relaxed">
            Sinh tự động kịch bản & Audio bằng AI (Gemini + Edge TTS)
          </p>
        </div>
      </Link>

    </div>
  );
}