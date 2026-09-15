// src/app/student/lessons/page.tsx
import React from 'react';
import { CategoryCard } from '@/components/student/features/CategoryCard';
import { Book, Headphones, PlayCircle, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/common/HeroBanner';

export default async function StudentCategoryPage() {
  const supabase = await createClient();

  // Fetch counts thực từ DB theo type
  const [
    { count: grammarCount },
    { count: audioCount },
    { count: videoCount },
  ] = await Promise.all([
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'file').eq('status', 'published'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'audio').eq('status', 'published'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'video').eq('status', 'published'),
  ]);

  const categories = [
    {
      title: "Ngữ pháp",
      ruTitle: "ГРАММАТИКА",
      description: `Gồm ${grammarCount ?? 0} bài giảng lý thuyết & ví dụ`,
      icon: <Book size={32} strokeWidth={2.2} />,
      href: "/student/lessons/grammars",
      colorScheme: 'blue' as const,
      buttonLabel: 'Khám phá',
    },
    {
      title: "Luyện nghe",
      ruTitle: "АУДИО",
      description: `Gồm ${audioCount ?? 0} file audio chuẩn phát âm`,
      icon: <Headphones size={32} strokeWidth={2.2} />,
      href: "/student/lessons/audios",
      colorScheme: 'indigo' as const,
      buttonLabel: 'Khám phá',
    },
    {
      title: "Video bài giảng",
      ruTitle: "ВИДЕО",
      description: `Gồm ${videoCount ?? 0} video bài học trực quan`,
      icon: <PlayCircle size={32} strokeWidth={2.2} />,
      href: "/student/lessons/videos",
      colorScheme: 'orange' as const,
      buttonLabel: 'Khám phá',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl flex-1 flex flex-col font-sans">
      {/* Banner Title "BÀI HỌC" - Sát bên trên */}
      <HeroBanner
        title="BÀI HỌC"
        ruTitle="УРОКИ"
        description="Khám phá kho tàng bài giảng đa dạng giúp bạn làm chủ tiếng Nga một cách toàn diện."
        icon={BookOpen}
        gradient="from-[#1a5286] via-blue-600 to-indigo-700"
      />

      {/* Grid Categories - Bố cục tự nhiên ngay dưới Banner */}
      <div className="pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              title={cat.title}
              ruTitle={cat.ruTitle}
              description={cat.description}
              icon={cat.icon}
              href={cat.href}
              colorScheme={cat.colorScheme}
              buttonLabel={cat.buttonLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
