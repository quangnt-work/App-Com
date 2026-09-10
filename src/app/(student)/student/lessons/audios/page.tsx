// src/app/(student)/student/lessons/audios/page.tsx
import { Inbox, Headphones } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { AudioLessonCard } from '@/components/student/lessons/audios/AudioLessonCard';
import { Pagination } from '@/components/common/Pagination';

interface AudioLessonsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AudioLessonsPage({ searchParams }: AudioLessonsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 12;

  // Fetch bài học có type='audio' từ bảng grammars, status='published'
  const { data, count, error } = await GrammarRepository.getByType('audio', currentPage, pageSize);
  const lessons: Grammar[] = (data as unknown as Grammar[]) ?? [];
  const isEmpty = lessons.length === 0;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="container mx-auto px-4 py-2 max-w-6xl font-sans">
      {/* Compact Header Bài Nghe */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-xs shadow-indigo-500/20">
            <Headphones size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Luyện nghe tiếng Nga
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Аудио
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {count != null ? `Tổng cộng ${count} bài nghe phát âm chuẩn bản xứ` : 'Luyện tập kỹ năng nghe hiểu tiếng Nga'}
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="bg-slate-50 p-4 rounded-full mb-3">
            <Inbox className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Chưa có bài nghe nào</h3>
          <p className="text-slate-500 text-xs mt-1">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <>
          {/* Grid 4 cột — đồng bộ với grammars page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {lessons.map((lesson, index) => (
              <AudioLessonCard
                key={lesson.id}
                lesson={lesson}
                index={(currentPage - 1) * pageSize + index}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && <Pagination totalPages={totalPages} />}
        </>
      )}
    </div>
  );
}