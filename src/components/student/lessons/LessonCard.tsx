// src/components/student/lessons/LessonCard.tsx
import Link from 'next/link'
import { FileText, MonitorPlay, ExternalLink } from 'lucide-react'
import { type Lesson } from '@/types/lesson'

interface LessonCardProps {
  lesson: Lesson;
  index: number;
}

export function LessonCard({ lesson, index }: LessonCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
      {/* Header Card: Icon & Số thứ tự bài */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-orange-50 p-2.5 rounded-xl text-[#f88137] group-hover:bg-[#f88137] group-hover:text-white transition-colors duration-300">
          <FileText className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tên bài học */}
      <h3 className="font-bold text-gray-800 mb-3 text-base md:text-lg line-clamp-2 min-h-[56px]">
        {lesson.title || `Bài ${index + 1}: Tiêu đề bài học`}
      </h3>

      {/* Loại tài liệu */}
      {/* Lưu ý: Đang hardcode "Tài liệu Powerpoint". 
          Bạn có thể thay đổi dựa trên type của lesson nếu database có lưu */}
      <div className="flex items-center text-xs text-gray-500 mb-6 font-medium">
        <MonitorPlay className="w-3.5 h-3.5 text-red-500 mr-2" />
        Tài liệu Powerpoint
      </div>

      {/* Nút Xem ngay */}
      <div className="mt-auto">
        <Link 
          href={`/student/lessons/${lesson.id}`} 
          className="flex items-center justify-center w-full py-2.5 bg-[#eef2ff] text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors text-sm"
        >
          Xem ngay <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}