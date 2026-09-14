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
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 flex flex-col shadow-xs border border-slate-200/80 hover:border-amber-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 h-full relative">
      
      {/* Header của thẻ: Icon bên trái, Label danh mục bên phải */}
      <div className="flex justify-between items-start mb-2.5">
        <div className="w-9 h-9 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-2xs">
          {exam.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100/90 border border-slate-200 uppercase tracking-wider px-2 py-0.5 rounded-md">
            {exam.category}
          </span>
          {exam.isCompleted && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
              ✓ Đã làm
            </span>
          )}
        </div>
      </div>

      {/* Thông tin bài kiểm tra */}
      <div className="flex-1 mb-2.5">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-[15px] mb-1.5 line-clamp-2 leading-snug min-h-[2.5rem]">
          {exam.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
           <div className="flex items-center gap-1">
             <Clock size={13} className="text-slate-400 shrink-0" />
             <span>{exam.duration}</span>
           </div>
           <div className="flex items-center gap-1">
             <FileQuestion size={13} className="text-slate-400 shrink-0" />
             <span>{exam.questionsCount}</span>
           </div>
        </div>
      </div>

      {/* Nút Làm bài / Làm lại */}
      <div className="mt-auto pt-1">
        <Link 
          href={exam.href}
          className={`w-full h-9 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-xs rounded-xl transition-all ${
            exam.isCompleted 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xs shadow-orange-500/20 hover:shadow-md'
          }`}
        >
          <span>{exam.isCompleted ? 'Làm lại' : 'Làm bài'}</span>
          <Play size={11} fill="currentColor" className="ml-0.5" />
        </Link>
      </div>
    </div>
  );
}