// src/app/(student)/student/lessons/audio/page.tsx
import Link from 'next/link'
import { ArrowLeft, Headphones } from 'lucide-react'
import { GrammarRepository } from "@/repositories/GrammarRepository";
import { type Grammar } from '@/types/grammar'
import { AudioLessonCard } from '@/components/student/lessons/audios/AudioLessonCard'
// Giả định bạn có component Pagination dùng chung
// import { Pagination } from '@/components/ui/Pagination'

export default async function AudioLessonsPage() {
  // 1. Fetch dữ liệu (Ở đây mình giả định bạn lấy các bài học thuộc category 'NGHE')
  // Thay đổi logic fetch này phù hợp với API/Database của bạn
  const response = await GrammarRepository.getByCategory('NGHE');
  const audioLessons = (response.data as unknown as Grammar[]) || [];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">

        {/* Banner NGHE */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center gap-4 mb-12 shadow-sm">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Headphones size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide relative z-10">
            NGHE
          </h1>
        </div>

        {audioLessons.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">
            Chưa có bài nghe nào được cập nhật.
          </div>
        ) : (
          <>
            {/* Grid Thẻ bài nghe (3 cột trên màn hình lớn) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {audioLessons.map((lesson) => (
                <AudioLessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                />
              ))}
            </div>

            {/* PHÂN TRANG */}
            <div className="mt-16 flex justify-center gap-2">
               {/* Thay thế bằng component Pagination thực tế của bạn. 
                 Dưới đây là HTML giả lập theo đúng thiết kế trong ảnh.
               */}
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
                 <ArrowLeft size={16} />
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f07b32] text-white font-bold shadow-sm">
                 1
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">
                 2
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">
                 3
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