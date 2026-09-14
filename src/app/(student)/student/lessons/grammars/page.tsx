import { Inbox, BookOpen } from 'lucide-react'
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar'
import { GrammarCard } from '@/components/student/lessons/grammars/GrammarCard';
import { Pagination } from '@/components/common/Pagination';
import { HeroBanner } from '@/components/common/HeroBanner';

interface GrammarsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LessonsPage({ searchParams }: GrammarsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 8;

  // Lấy tất cả bài ngữ pháp (type='file') đã published, có phân trang (8 bài/trang)
  const { data, count, error } = await GrammarRepository.getByType('file', currentPage, pageSize);
  const lessonsToDisplay = (data as unknown as Grammar[]) || [];
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const isEmpty = lessonsToDisplay.length === 0;

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner Ngữ pháp - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="NGỮ PHÁP TIẾNG NGA"
          ruTitle="ГРАММАТИКА"
          description={totalCount > 0 ? `Tổng cộng ${totalCount} bài giảng lý thuyết & ví dụ minh họa chuẩn hóa` : 'Hệ thống bài giảng ngữ pháp chuẩn hóa'}
          icon={BookOpen}
          gradient="from-blue-700 via-blue-600 to-indigo-700"
        />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="bg-slate-50 p-3 rounded-full mb-2">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Chưa có bài học nào</h3>
            <p className="text-slate-500 text-xs mt-0.5">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          /* Grid Thẻ bài học (4 cột x 2 hàng = 8 thẻ vừa vặn màn hình) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {lessonsToDisplay.map((grammar, index) => (
              <GrammarCard
                key={grammar.id}
                grammar={grammar}
                index={(currentPage - 1) * pageSize + index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Phân trang cố định sát Footer */}
      {totalPages > 1 && (
        <div className="mt-auto pt-3 pb-1 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
