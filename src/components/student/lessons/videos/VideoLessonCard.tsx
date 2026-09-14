// src/components/student/lessons/videos/VideoLessonCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, Clock, ExternalLink } from 'lucide-react';
import { type Grammar } from '@/types/grammar';

interface VideoLessonCardProps {
  lesson: Grammar;
  index: number;
}

export function VideoLessonCard({ lesson, index }: VideoLessonCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col hover:border-rose-300 hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1.5 transition-all duration-300 group h-full relative">
      {/* Thumbnail / Preview area */}
      <div className="relative h-28 sm:h-30 w-full bg-gradient-to-br from-rose-50 to-red-100 overflow-hidden flex items-center justify-center">
        {lesson.thumbnail ? (
          <Image
            src={lesson.thumbnail}
            alt={lesson.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Placeholder khi không có thumbnail
          <div className="flex flex-col items-center gap-2 text-rose-300">
            <PlayCircle size={44} strokeWidth={1.5} />
          </div>
        )}
        {/* Overlay & Play icon */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <PlayCircle
            size={44}
            className="text-white opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md"
            strokeWidth={1.5}
          />
        </div>
        {/* Badge số thứ tự */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md uppercase tracking-wider">
          Bài {index + 1}
        </span>
        {/* Thời lượng */}
        {lesson.duration && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
      </div>

      {/* Nội dung Card */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1">
        {/* Badge loại */}
        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 w-fit mb-1 uppercase tracking-wider">
          🎬 Video bài giảng
        </span>

        {/* Tiêu đề */}
        <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-0.5 group-hover:text-rose-600 transition-colors leading-snug">
          {lesson.title}
        </h3>

        {/* Mô tả ngắn */}
        {lesson.description && (
          <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mb-1.5 leading-relaxed font-medium">
            {lesson.description}
          </p>
        )}

        {/* Nút Xem ngay */}
        <div className="mt-auto pt-1.5 border-t border-slate-100/80">
          <Link
            href={`/student/lessons/videos/${lesson.id}`}
            className="h-8 flex items-center justify-center w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-xl shadow-xs shadow-rose-500/20 hover:shadow-md hover:from-rose-700 hover:to-red-700 transition-all text-xs uppercase tracking-wider"
          >
            <span>Xem video</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}