// src/components/student/lessons/audio/AudioLessonCard.tsx
import Link from 'next/link'
import { Headphones } from 'lucide-react'
import { type Grammar } from '@/types/grammar'

interface AudioLessonCardProps {
  lesson: Grammar;
}

export function AudioLessonCard({ lesson }: AudioLessonCardProps) {
  return (
    <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Icon tai nghe */}
      <div className="text-gray-400 mb-6">
        <Headphones size={48} strokeWidth={1.5} />
      </div>

      {/* Tiêu đề bài nghe */}
      <h3 className="font-bold text-gray-900 text-lg mb-8 min-h-[56px] flex items-center justify-center">
        {lesson.title}
      </h3>

      {/* Nút Nghe ngay */}
      <Link 
        href={`/student/lessons/${lesson.id}`} 
        className="w-full py-3 px-6 bg-[#f07b32] text-white font-bold rounded-xl hover:bg-[#d96b27] transition-colors"
      >
        Nghe ngay
      </Link>
    </div>
  )
}