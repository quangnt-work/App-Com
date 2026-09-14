// src/components/student/lessons/audios/AudioLessonCard.tsx
import Link from 'next/link';
import { Headphones, Clock, ExternalLink } from 'lucide-react';
import { type Grammar } from '@/types/grammar';

interface AudioLessonCardProps {
  lesson: Grammar;
  index: number;
}

export function AudioLessonCard({ lesson, index }: AudioLessonCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 flex flex-col hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300 group h-full relative">
      {/* Header: Icon & Số thứ tự */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-2xs">
          <Headphones className="w-4.5 h-4.5" />
        </div>
        <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50/90 border border-indigo-100 uppercase tracking-wider px-2.5 py-0.5 rounded-md">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tiêu đề */}
      <h3 className="font-extrabold text-slate-900 mb-1 text-sm sm:text-[15px] line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug min-h-[2.5rem]">
        {lesson.title}
      </h3>

      {/* Mô tả ngắn nếu có */}
      {lesson.description && (
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5 leading-relaxed font-medium">
          {lesson.description}
        </p>
      )}

      {/* Badge loại + thời lượng */}
      <div className="flex items-center gap-2 mb-2.5 text-[11px] text-slate-500 font-medium">
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold border border-indigo-100 text-[10px] uppercase">
          🎧 Audio
        </span>
        {lesson.duration && (
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration}
          </span>
        )}
      </div>

      {/* Nút Nghe ngay */}
      <div className="mt-auto pt-1">
        <Link
          href={`/student/lessons/audios/${lesson.id}`}
          className="h-9 flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-xs shadow-indigo-500/20 hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all text-xs uppercase tracking-wider"
        >
          <span>Nghe bài học</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}