// src/components/student/lessons/video/VideoLessonCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'
import { type Grammar } from '@/types/grammar'

interface VideoLessonCardProps {
  lesson: Grammar;
}

export function VideoLessonCard({ lesson }: VideoLessonCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Thumbnail Video */}
      <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
        <Image 
          src={lesson.thumbnail || '/placeholder-video.jpg'} // Nhớ chuẩn bị ảnh fallback
          alt={lesson.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Lớp overlay và Icon Play ở giữa (tùy chọn để tăng UX) */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" strokeWidth={1.5} />
        </div>
        {/* Label thời lượng (nếu có trong data) */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
            12:45
        </div>
      </div>

      {/* Nội dung Card */}
      <div className="p-6 flex flex-col flex-1">
        {/* Tiêu đề bài video */}
        <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2 min-h-[56px]">
          {lesson.title}
        </h3>

        {/* Nút Xem ngay */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link 
            href={`/student/lessons/${lesson.id}`} 
            className="flex items-center justify-center w-full py-3 px-6 bg-[#e11d48] text-white font-bold rounded-xl hover:bg-[#be123c] transition-colors"
          >
            Xem Video
          </Link>
        </div>
      </div>
    </div>
  )
}