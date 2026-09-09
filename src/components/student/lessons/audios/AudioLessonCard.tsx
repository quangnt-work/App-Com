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
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 flex flex-col hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group h-full">
      {/* Header: Icon & Số thứ tự */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          <Headphones className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tiêu đề */}
      <h3 className="font-bold text-gray-800 mb-3 text-base md:text-lg line-clamp-2 min-h-[56px] group-hover:text-blue-600 transition-colors">
        {lesson.title}
      </h3>

      {/* Mô tả ngắn nếu có */}
      {lesson.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {lesson.description}
        </p>
      )}

      {/* Badge loại + thời lượng */}
      <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 font-medium">
        <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold border border-blue-200/50">
          🎧 Audio
        </span>
        {lesson.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </span>
        )}
      </div>

      {/* Nút Nghe ngay */}
      <div className="mt-auto">
        <Link
          href={`/student/lessons/audios/${lesson.id}`}
          className="flex items-center justify-center w-full py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-md hover:shadow-blue-500/20 transition-all text-sm"
        >
          Nghe ngay <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}