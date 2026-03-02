// src/app/(student)/student/lessons/video/page.tsx
import Link from 'next/link'
import { ArrowLeft, PlaySquare } from 'lucide-react'
import { GrammarRepository } from "@/repositories/GrammarRepository";
import { type Grammar } from '@/types/grammar'
import { VideoLessonCard } from '@/components/student/lessons/videos/VideoLessonCard'

export default async function VideoLessonsPage() {
  // 1. Fetch dữ liệu (Giả định lấy các bài học có category hoặc type là 'VIDEO')
  const response = await GrammarRepository.getByCategory('VIDEO'); 
  const videoLessons = (response.data as unknown as Grammar[]) || [];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">

        {/* Banner VIDEO (Sử dụng màu đỏ #e11d48 - Rose 600) */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center gap-4 mb-12 shadow-sm">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <PlaySquare size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide relative z-10">
            VIDEO
          </h1>
          {/* Icon mờ trang trí */}
          <PlaySquare size={160} className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-10 rotate-12" strokeWidth={1} />
        </div>

        {videoLessons.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic bg-white rounded-3xl border border-gray-100 shadow-sm">
            Chưa có video bài giảng nào được cập nhật.
          </div>
        ) : (
          <>
            {/* Grid Thẻ bài video (3 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoLessons.map((lesson) => (
                <VideoLessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                />
              ))}
            </div>

            {/* PHÂN TRANG */}
            <div className="mt-16 flex justify-center gap-2">
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
                 <ArrowLeft size={16} />
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e11d48] text-white font-bold shadow-sm">
                 1
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">
                 2
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
                 <ArrowLeft size={16} className="rotate-180" />
               </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}