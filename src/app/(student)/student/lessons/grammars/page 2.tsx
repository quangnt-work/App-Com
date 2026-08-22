import { Inbox, BookOpen } from 'lucide-react'
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar'
import { GrammarCard } from '@/components/student/lessons/grammars/GrammarCard';

interface GrammarsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LessonsPage({ searchParams }: GrammarsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 12;

  // Lấy tất cả bài ngữ pháp (type='file') đã published, có phân trang
  const { data, count, error } = await GrammarRepository.getByType('file', currentPage, pageSize);
  const lessonsToDisplay = (data as unknown as Grammar[]) || [];
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const isEmpty = lessonsToDisplay.length === 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">

      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">

        {/* Banner Cam */}
        <div className="relative bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center gap-4 mb-12 shadow-sm overflow-hidden">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <BookOpen size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide relative z-10">
              Ngữ pháp
            </h1>
            {totalCount > 0 && (
              <p className="text-white/80 text-sm mt-1">{totalCount} bài giảng</p>
            )}
          </div>
          {/* Icon Book mờ làm background */}
          <BookOpen
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10 transform -rotate-12"
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

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`?page=${page}`}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${page === currentPage
                        ? 'bg-[#f07b32] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[#f07b32] hover:text-[#f07b32]'
                      }`}
                  >
                    {page}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
