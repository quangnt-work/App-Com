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
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-900/5 hover:-translate-y-0.5 transition-all duration-200 group h-full">
      {/* Header: Icon & Số thứ tự */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
          <Headphones className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tiêu đề */}
      <h3 className="font-bold text-slate-800 mb-1 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
        {lesson.title}
      </h3>

      {/* Mô tả ngắn nếu có */}
      {lesson.description && (
        <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 leading-relaxed">
          {lesson.description}
        </p>
      )}

      {/* Badge loại + thời lượng */}
      <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-400 font-medium">
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold border border-indigo-100 text-[10px]">
          🎧 Audio
        </span>
        {lesson.duration && (
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </span>
        )}
      </div>

      {/* Nút Nghe ngay */}
      <div className="mt-auto">
        <Link
          href={`/student/lessons/audios/${lesson.id}`}
          className="flex items-center justify-center w-full py-2 bg-indigo-50/80 text-indigo-600 font-semibold rounded-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:shadow-xs transition-all text-xs"
        >
          Nghe bài học <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
}