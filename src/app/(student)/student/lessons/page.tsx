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
      description: `Gồm ${grammarCount ?? 0} bài giảng`,
      icon: <Book size={36} />,
      href: "/student/lessons/grammars"
    },
    {
      title: "Nghe",
      description: `Gồm ${audioCount ?? 0} file nghe`,
      icon: <Headphones size={36} />,
      href: "/student/lessons/audios"
    },
    {
      title: "Video",
      description: `Gồm ${videoCount ?? 0} video`,
      icon: <PlayCircle size={36} />,
      href: "/student/lessons/videos"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">

        {/* Banner Title "BÀI HỌC" */}
        <HeroBanner
          title="BÀI HỌC"
          description="Khám phá kho tàng bài giảng đa dạng giúp bạn làm chủ tiếng Nga một cách toàn diện."
          icon={BookOpen}
        />

        {/* Grid Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              title={cat.title}
              description={cat.description}
              icon={cat.icon}
              href={cat.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
