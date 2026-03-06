// src/components/student/lessons/videos/VideoLessonCard.tsx
import Link from 'next/link';
import { PlayCircle, Clock, ExternalLink } from 'lucide-react';
import { type Grammar } from '@/types/grammar';

interface VideoLessonCardProps {
  lesson: Grammar;
  index: number;
}

export function VideoLessonCard({ lesson, index }: VideoLessonCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
      {/* Thumbnail / Preview area */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-rose-50 to-red-100 overflow-hidden flex items-center justify-center">
        {lesson.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lesson.thumbnail}
            alt={lesson.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Placeholder khi không có thumbnail
          <div className="flex flex-col items-center gap-2 text-rose-300">
            <PlayCircle size={48} strokeWidth={1.5} />
          </div>
        )}
        {/* Overlay & Play icon */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <PlayCircle
            size={48}
            className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md"
            strokeWidth={1.5}
          />
        </div>
        {/* Badge số thứ tự */}
        <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
          Bài {index + 1}
        </span>
        {/* Thời lượng */}
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
      </div>

      {/* Nội dung Card */}
      <div className="p-5 flex flex-col flex-1">
        {/* Badge loại */}
        <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full w-fit mb-2">
          🎬 Video
        </span>

        {/* Tiêu đề */}
        <h3 className="font-bold text-gray-800 text-base md:text-lg line-clamp-2 min-h-[56px] mb-2">
          {lesson.title}
        </h3>

        {/* Mô tả ngắn */}
        {lesson.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {lesson.description}
          </p>
        )}

        {/* Nút Xem ngay */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/student/lessons/videos/${lesson.id}`}
            className="flex items-center justify-center w-full py-2.5 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-500 hover:text-white transition-colors text-sm"
          >
            Xem video <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}