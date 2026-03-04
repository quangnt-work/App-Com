// src/app/student/lessons/page.tsx
import React from 'react';
import { CategoryCard } from '@/components/student/features/CategoryCard';
import { Book, Headphones, PlayCircle, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/common/HeroBanner';

export default async function StudentCategoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userData = user ? { 
    name: String(user.user_metadata?.full_name || user.email || "Học viên"), 
    role: String(user.user_metadata?.role || 'STUDENT') 
  } : null;

  const categories = [
    {
      title: "Ngữ pháp",
      description: "Gồm 23 bài giảng Power point",
      icon: <Book size={36} />,
      href: "/student/lessons/grammars" // Điều hướng tới trang lessons hiện tại
    },
    {
      title: "Nghe",
      description: "Gồm 50 file nghe",
      icon: <Headphones size={36} />,
      href: "/student/lessons/audios" // Route giả định
    },
    {
      title: "Video",
      description: "Gồm 20 video",
      icon: <PlayCircle size={36} />,
      href: "/student/lessons/videos" // Route giả định
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
          
          {/* Banner Title "BÀI HỌC" */}
          {/* Đã thêm justify-center để căn giữa toàn bộ nội dung (icon + text) */}
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