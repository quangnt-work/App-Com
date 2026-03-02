// src/app/student/page.tsx
import React from 'react';
import { CategoryCard } from '@/components/student/lessons/grammars/features/CategoryCard';
import { Book, Headphones, PlayCircle, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

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
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Banner Title "BÀI HỌC" */}
          <div className="relative mb-16 flex justify-center">
            <div className="bg-orange-500 rounded-full py-3 px-16 flex items-center gap-4 shadow-lg shadow-orange-200">
              <div className="absolute left-[calc(50%-180px)] w-14 h-14 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center text-orange-500 shadow-sm">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-white text-3xl font-black uppercase tracking-[0.2em] ml-6">
                Bài học
              </h2>
            </div>
          </div>

          {/* Grid Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
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
        </div>
      </main>

    </div>
  );
}