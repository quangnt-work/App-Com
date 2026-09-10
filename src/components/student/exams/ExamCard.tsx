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
    <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col shadow-xs border border-slate-200/80 hover:border-amber-300 hover:shadow-md hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all duration-200 h-full relative">
      
      {/* Header của thẻ: Icon bên trái, Label danh mục bên phải */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg flex items-center justify-center shadow-2xs">
          {exam.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {exam.category}
          </span>
          {exam.isCompleted && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[10px] font-bold px-2 py-0.5 rounded-md">
              ✓ Đã làm
            </span>
          )}
        </div>
      </div>

      {/* Thông tin bài kiểm tra */}
      <div className="flex-1 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-2.5 line-clamp-2 leading-snug">
          {exam.title}
        </h3>
        <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
           <div className="flex items-center gap-1.5">
             <Clock size={14} className="text-slate-400 shrink-0" />
             <span>{exam.duration}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <FileQuestion size={14} className="text-slate-400 shrink-0" />
             <span>{exam.questionsCount}</span>
           </div>
        </div>
      </div>

      {/* Nút Làm bài / Làm lại */}
      <Link 
        href={exam.href}
        className={`w-full py-2 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-xs rounded-lg transition-all mt-auto ${
          exam.isCompleted 
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
            : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xs shadow-orange-500/20 hover:shadow-md'
        }`}
      >
        <span>{exam.isCompleted ? 'Làm lại' : 'Làm bài'}</span>
        <Play size={12} fill="currentColor" className="ml-0.5" />
      </Link>
    </div>
  );
}