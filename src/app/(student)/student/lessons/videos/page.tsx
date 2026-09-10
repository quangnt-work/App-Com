// src/app/(student)/student/lessons/videos/page.tsx
import { Inbox, PlayCircle } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { VideoLessonCard } from '@/components/student/lessons/videos/VideoLessonCard';

export default async function VideoLessonsPage() {
  // Fetch bài học có type='video' từ bảng grammars, status='published'
  const { data, count, error } = await GrammarRepository.getByType('video');
  const lessons: Grammar[] = (data as unknown as Grammar[]) ?? [];
  const isEmpty = lessons.length === 0;

  return (
    <div className="container mx-auto px-4 py-2 max-w-6xl font-sans">
      {/* Compact Header Video */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-600 to-red-600 text-white p-2.5 rounded-xl shadow-xs shadow-rose-500/20">
            <PlayCircle size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Video bài giảng tiếng Nga
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                Видео
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {count != null ? `Tổng cộng ${count} video bài giảng sinh động, trực quan` : 'Học tiếng Nga qua hình ảnh và tình huống'}
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
          <h3 className="text-base font-bold text-slate-900">Chưa có video nào</h3>
          <p className="text-slate-500 text-xs mt-1">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        // Grid 3 cột cho video
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {lessons.map((lesson, index) => (
            <VideoLessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}