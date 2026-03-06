// src/app/(student)/student/lessons/audios/page.tsx
import { Inbox, Headphones } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { AudioLessonCard } from '@/components/student/lessons/audios/AudioLessonCard';

export default async function AudioLessonsPage() {
  // Fetch bài học có type='audio' từ bảng grammars, status='published'
  const { data, count, error } = await GrammarRepository.getByType('audio');
  const lessons: Grammar[] = (data as unknown as Grammar[]) ?? [];
  const isEmpty = lessons.length === 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">

        {/* Banner Cam — đồng bộ style grammars */}
        <div className="relative bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center gap-4 mb-12 shadow-sm overflow-hidden">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Headphones size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
              Bài Nghe
            </h1>
            {count != null && (
              <p className="text-white/80 text-sm mt-1">{count} bài nghe</p>
            )}
          </div>
          {/* Icon trang trí mờ */}
          <Headphones
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10 -rotate-12"
            strokeWidth={1.5}
          />
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Inbox className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Chưa có bài nghe nào</h3>
            <p className="text-slate-500 mt-2">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          // Grid 4 cột — đồng bộ với grammars page
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson, index) => (
              <AudioLessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}