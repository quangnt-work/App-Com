// src/components/student/exams/ExamCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { Clock, FileQuestion, Play } from 'lucide-react';

export interface ExamItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  questionsCount: string;
  icon: ReactNode;
  href: string;
  isCompleted?: boolean;
}

interface ExamCardProps {
  exam: ExamItem;
}

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full relative">
      
      {/* Header của thẻ: Icon bên trái, Label danh mục bên phải */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-[#fff2ea] text-[#f07b32] rounded-xl flex items-center justify-center">
          {exam.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-2">
            {exam.category}
          </span>
          {exam.isCompleted && (
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ✅ Đã làm
            </span>
          )}
        </div>
      </div>

      {/* Thông tin bài kiểm tra */}
      <div className="flex-1 mb-8">
        <h3 className="font-bold text-gray-900 text-xl mb-4 line-clamp-2">
          {exam.title}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-gray-500 font-medium">
           <div className="flex items-center gap-2">
             <Clock size={16} className="text-gray-400" />
             {exam.duration}
           </div>
           <div className="flex items-center gap-2">
             <FileQuestion size={16} className="text-gray-400" />
             {exam.questionsCount}
           </div>
        </div>
      </div>

      {/* Nút Làm bài / Làm lại */}
      <Link 
        href={exam.href}
        className={`w-full py-3 flex items-center justify-center gap-2 font-bold rounded-xl transition-colors mt-auto ${
          exam.isCompleted 
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
            : 'bg-[#f07b32] text-white hover:bg-[#d96b27]'
        }`}
      >
        {exam.isCompleted ? 'Làm lại' : 'Làm bài'}
        <Play size={14} fill="currentColor" className="ml-1" />
      </Link>
    </div>
  );
}