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
        href="/admin/students"
        className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-slate-600 font-semibold text-lg">Tổng học viên</h3>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            {stats.totalStudents.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-emerald-600 text-sm font-medium flex items-center gap-1">
          ↗ +12% tháng này
        </div>
      </Link>

      {/* Card 2: Tổng bài học */}
      <Link
        href="/admin/lessons"
        className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-slate-600 font-semibold text-lg">Tổng bài học</h3>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            {stats.totalGrammars.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-slate-500 text-sm space-y-2">
          <p className="flex items-center gap-2">📄 Ngữ pháp: {stats.grammarFileCount}</p>
          <p className="flex items-center gap-2">▶️ Video: {stats.videoCount}</p>
          <p className="flex items-center gap-2">🎧 Audio: {stats.audioCount}</p>
        </div>
      </Link>

      {/* Card 3: Tổng đề thi */}
      <Link
        href="/admin/exams"
        className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 hover:border-orange-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-slate-600 font-semibold text-lg">Tổng đề thi</h3>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CheckSquare size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            {stats.totalExams.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-slate-500 text-sm space-y-2">
          <p className="flex items-center gap-2">🔗 Tổng hợp: {stats.examMixedCount}</p>
          <p className="flex items-center gap-2">📝 Ngữ pháp: {stats.examGrammarCount}</p>
          <p className="flex items-center gap-2">📖 Đọc hiểu: {stats.examReadingCount}</p>
          <p className="flex items-center gap-2">🎧 Nghe: {stats.examListeningCount}</p>
        </div>
      </Link>

      {/* Card 4: Tài liệu */}
      <Link
        href="/admin/documents"
        className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-slate-600 font-semibold text-lg">Tài liệu</h3>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Folder size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            {stats.totalDocuments.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto pt-6 text-slate-500 text-sm space-y-1">
          <p className="flex items-center gap-2">📄 Tổng tài liệu số: {stats.totalDocuments}</p>
        </div>
      </Link>

      {/* Card 5: Quản lý AI */}
      <Link
        href="/admin/ai"
        className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-200"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-slate-600 font-semibold text-lg">Công cụ AI</h3>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Sparkles size={24} />
          </div>
        </div>
        <div>
          <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            2
          </span>
        </div>
        <div className="mt-auto pt-6 text-slate-500 text-sm space-y-2">
          <p className="flex items-center gap-2">🪄 AI Shadowing</p>
          <p className="flex items-center gap-2">🎭 AI Roleplay</p>
        </div>
      </Link>

    </div>
  );
}