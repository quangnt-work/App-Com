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
    <div className="bg-white rounded-3xl p-6 flex flex-col shadow-sm border border-slate-200/80 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 h-full relative">
      
      {/* Header của thẻ: Icon bên trái, Label danh mục bên phải */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-amber-50 border border-amber-100/80 text-amber-600 rounded-xl flex items-center justify-center">
          {exam.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-2">
            {exam.category}
          </span>
          {exam.isCompleted && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ✅ Đã làm
            </span>
          )}
        </div>
      </div>

      {/* Thông tin bài kiểm tra */}
      <div className="flex-1 mb-8">
        <h3 className="font-bold text-slate-900 text-xl mb-4 line-clamp-2">
          {exam.title}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-slate-500 font-medium">
           <div className="flex items-center gap-2">
             <Clock size={16} className="text-slate-400" />
             {exam.duration}
           </div>
           <div className="flex items-center gap-2">
             <FileQuestion size={16} className="text-slate-400" />
             {exam.questionsCount}
           </div>
        </div>
      </div>

      {/* Nút Làm bài / Làm lại */}
      <Link 
        href={exam.href}
        className={`w-full py-3 flex items-center justify-center gap-2 font-bold rounded-xl transition-all mt-auto ${
          exam.isCompleted 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35'
        }`}
      >
        {exam.isCompleted ? 'Làm lại' : 'Làm bài'}
        <Play size={14} fill="currentColor" className="ml-1" />
      </Link>
    </div>
  );
}