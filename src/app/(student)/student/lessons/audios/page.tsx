// src/app/(student)/student/lessons/audios/page.tsx
import { Inbox, Headphones } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { AudioLessonCard } from '@/components/student/lessons/audios/AudioLessonCard';
import { Pagination } from '@/components/common/Pagination';
import { HeroBanner } from '@/components/common/HeroBanner';

interface AudioLessonsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AudioLessonsPage({ searchParams }: AudioLessonsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  // Fetch bài học có type='audio' từ bảng grammars, status='published' (8 bài/trang)
  const { data, count, error } = await GrammarRepository.getByType('audio', currentPage, pageSize);
  const lessons: Grammar[] = (data as unknown as Grammar[]) ?? [];
  const isEmpty = lessons.length === 0;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner Bài Nghe - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="LUYỆN NGHE TIẾNG NGA"
          ruTitle="АУДИО"
          description={count != null ? `Tổng cộng ${count} bài nghe phát âm chuẩn bản xứ rèn luyện kỹ năng phản xạ` : 'Luyện tập kỹ năng nghe hiểu tiếng Nga'}
          icon={Headphones}
          gradient="from-indigo-700 via-indigo-600 to-violet-700"
        />

        {/* Empty state */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="bg-slate-50 p-3 rounded-full mb-2">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Chưa có bài nghe nào</h3>
            <p className="text-slate-500 text-xs mt-0.5">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          /* Grid 4 cột x 2 hàng = 8 thẻ vừa vặn màn hình */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {lessons.map((lesson, index) => (
              <AudioLessonCard
                key={lesson.id}
                lesson={lesson}
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
  );
}