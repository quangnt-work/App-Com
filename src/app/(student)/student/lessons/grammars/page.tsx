import { Inbox, BookOpen } from 'lucide-react'
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar'
import { GrammarCard } from '@/components/student/lessons/grammars/GrammarCard';
export default async function LessonsPage() {
  // 1. Giữ nguyên logic fetch dữ liệu thật
  const [englishLessons, russianLessons, itLessons, otherLessons] = await Promise.all([
    GrammarRepository.getByCategory('TIẾNG ANH'),
    GrammarRepository.getByCategory('TIẾNG NGA'),
    GrammarRepository.getByCategory('CNTT'),
    GrammarRepository.getByCategory('KHÁC')
  ]);

  // Chọn mảng dữ liệu để hiển thị lên Grid (Dựa theo ảnh là trang Ngữ Pháp tiếng Nga)
  // Bạn có thể sửa logic gộp mảng hoặc lấy mảng tương ứng với trang hiện tại
  const lessonsToDisplay = (russianLessons.data as unknown as Grammar[]) || [];

  const isEmpty = lessonsToDisplay.length === 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">

      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Banner Cam */}
        <div className="bg-[#f88137] text-white rounded-xl p-10 md:p-14 relative overflow-hidden mb-6 shadow-sm">
          <h1 className="text-3xl md:text-5xl font-bold relative z-10 tracking-wide uppercase">
            Ngữ pháp
          </h1>
          {/* Icon Book mờ làm background */}
          <BookOpen 
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-20 transform -rotate-12" 
            strokeWidth={1.5} 
          />
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="bg-slate-50 p-6 rounded-full mb-4">
               <Inbox className="h-12 w-12 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">Chưa có bài học nào</h3>
             <p className="text-slate-500 mt-2">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <>
            {/* Grid Thẻ bài học */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lessonsToDisplay.map((grammar, index) => (
                <GrammarCard 
                  key={grammar.id} 
                  grammar={grammar} 
                  index={index} 
                />  
              ))}
            </div>

            {/* 3. PHÂN TRANG CÓ SẴN */}
            <div className="mt-12 flex justify-center">
              {/* <Pagination totalPages={10} currentPage={1} /> */}
            </div>
          </>
        )}
      </main>
    </div>
  )
}