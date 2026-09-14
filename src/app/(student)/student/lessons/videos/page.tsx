// src/app/(student)/student/lessons/videos/page.tsx
import { Inbox, PlayCircle } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { VideoLessonCard } from '@/components/student/lessons/videos/VideoLessonCard';
import { Pagination } from '@/components/common/Pagination';
import { HeroBanner } from '@/components/common/HeroBanner';

interface VideoLessonsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VideoLessonsPage({ searchParams }: VideoLessonsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  // Fetch bài học có type='video' từ bảng grammars, status='published' (8 bài/trang)
  const { data, count, error } = await GrammarRepository.getByType('video', currentPage, pageSize);
  const lessons: Grammar[] = (data as unknown as Grammar[]) ?? [];
  const isEmpty = lessons.length === 0;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner Video - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="VIDEO BÀI GIẢNG TIẾNG NGA"
          ruTitle="ВИДЕО"
          description={count != null ? `Tổng cộng ${count} video bài giảng sinh động giúp học tiếng Nga qua hình ảnh trực quan` : 'Học tiếng Nga qua hình ảnh và tình huống'}
          icon={PlayCircle}
          gradient="from-rose-600 via-rose-500 to-red-600"
        />

        {/* Empty state */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="bg-slate-50 p-3 rounded-full mb-2">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Chưa có video nào</h3>
            <p className="text-slate-500 text-xs mt-0.5">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          /* Grid 4 cột x 2 hàng = 8 thẻ vừa vặn màn hình */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {lessons.map((lesson, index) => (
              <VideoLessonCard
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