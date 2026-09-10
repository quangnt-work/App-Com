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
      description: `Gồm ${grammarCount ?? 0} bài giảng lý thuyết & ví dụ`,
      icon: <Book size={24} strokeWidth={2.2} />,
      href: "/student/lessons/grammars",
      colorScheme: 'blue' as const,
    },
    {
      title: "Luyện nghe",
      description: `Gồm ${audioCount ?? 0} file audio chuẩn phát âm`,
      icon: <Headphones size={24} strokeWidth={2.2} />,
      href: "/student/lessons/audios",
      colorScheme: 'indigo' as const,
    },
    {
      title: "Video bài giảng",
      description: `Gồm ${videoCount ?? 0} video bài học trực quan`,
      icon: <PlayCircle size={24} strokeWidth={2.2} />,
      href: "/student/lessons/videos",
      colorScheme: 'orange' as const,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-2 max-w-5xl">
      {/* Banner Title "BÀI HỌC" */}
      <HeroBanner
        title="BÀI HỌC"
        description="Khám phá kho tàng bài giảng đa dạng giúp bạn làm chủ tiếng Nga một cách toàn diện."
        icon={BookOpen}
      />

      {/* Grid Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat, index) => (
          <CategoryCard
            key={index}
            title={cat.title}
            description={cat.description}
            icon={cat.icon}
            href={cat.href}
            colorScheme={cat.colorScheme}
          />
        ))}
      </div>
    </div>
  );
}
