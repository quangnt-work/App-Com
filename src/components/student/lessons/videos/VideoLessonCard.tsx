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
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden flex flex-col hover:border-rose-300 hover:shadow-md hover:shadow-rose-900/5 hover:-translate-y-0.5 transition-all duration-200 group h-full">
      {/* Thumbnail / Preview area */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-rose-50 to-red-100 overflow-hidden flex items-center justify-center">
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
            <PlayCircle size={40} strokeWidth={1.5} />
          </div>
        )}
        {/* Overlay & Play icon */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <PlayCircle
            size={40}
            className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md"
            strokeWidth={1.5}
          />
        </div>
        {/* Badge số thứ tự */}
        <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase tracking-wider">
          Bài {index + 1}
        </span>
        {/* Thời lượng */}
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
      </div>

      {/* Nội dung Card */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Badge loại */}
        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 w-fit mb-1.5">
          🎬 Video
        </span>

        {/* Tiêu đề */}
        <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 mb-1.5 group-hover:text-rose-600 transition-colors leading-snug">
          {lesson.title}
        </h3>

        {/* Mô tả ngắn */}
        {lesson.description && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mb-2.5 leading-relaxed">
            {lesson.description}
          </p>
        )}

        {/* Nút Xem ngay */}
        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <Link
            href={`/student/lessons/videos/${lesson.id}`}
            className="flex items-center justify-center w-full py-2 bg-rose-50/80 text-rose-600 font-semibold rounded-lg hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 hover:text-white hover:shadow-xs transition-all text-xs"
          >
            Xem video <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}