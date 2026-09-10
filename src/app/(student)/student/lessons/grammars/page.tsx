import { Inbox, BookOpen } from 'lucide-react'
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar'
import { GrammarCard } from '@/components/student/lessons/grammars/GrammarCard';
import { Pagination } from '@/components/common/Pagination';

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
    <div className="container mx-auto px-4 py-2 max-w-6xl font-sans">
      {/* Compact Header Ngữ pháp */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-xs shadow-blue-500/20">
            <BookOpen size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Ngữ pháp tiếng Nga
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Грамматика
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {totalCount > 0 ? `Tổng cộng ${totalCount} bài giảng lý thuyết & ví dụ minh họa` : 'Hệ thống bài giảng ngữ pháp chuẩn hóa'}
            </p>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="bg-slate-50 p-4 rounded-full mb-3">
            <Inbox className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Chưa có bài học nào</h3>
          <p className="text-slate-500 text-xs mt-1">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <>
          {/* Grid Thẻ bài học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {lessonsToDisplay.map((grammar, index) => (
              <GrammarCard
                key={grammar.id}
                grammar={grammar}
                index={index}
              />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && <Pagination totalPages={totalPages} />}
        </>
      )}
    </div>
  )
}
