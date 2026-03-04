// src/app/(student)/student/ai/page.tsx
import React from 'react';
import { Bot, Mic, BookOpenCheck, MessageSquare, Book, BookOpen } from 'lucide-react';
import { CategoryCard } from '@/components/student/features/CategoryCard';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/common/HeroBanner';

export default async function AIPracticePage() {
  // Xác thực người dùng (giống cấu trúc các trang khác của bạn)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const features = [
    {
      title: "Luyện nói",
      description: "Cải thiện phát âm và ngữ điệu thông qua phản hồi thời gian thực từ AI.",
      icon: <Mic size={28} strokeWidth={2} />,
      href: "/student/ai/speaking" // Thay bằng route thực tế của bạn
    },
    {
      title: "Ngữ pháp",
      description: "Hệ thống bài tập thông minh giúp bạn nắm vững cấu trúc ngữ pháp Nga.",
      icon: <BookOpenCheck size={28} strokeWidth={2} />,
      href: "/student/ai/grammar"
    },
    {
      title: "Giao tiếp AI",
      description: "Trò chuyện tự nhiên với trợ lý ảo về nhiều chủ đề trong đời sống.",
      icon: <MessageSquare size={28} strokeWidth={2} />,
      href: "/student/ai/chat"
    },
    {
      title: "Từ điển AI",
      description: "Tra cứu từ vựng thông minh với ngữ cảnh và ví dụ minh họa sinh động.",
      icon: <Book size={28} strokeWidth={2} />,
      href: "/student/ai/dictionary"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Banner "LUYỆN TẬP CÙNG AI" */}
        <HeroBanner 
          title="Luyện cùng AI"
          description="Nâng tầm kỹ năng tiếng Nga với trí tuệ nhân tạo thế hệ mới."
          icon={Bot}
        />

        {/* Grid tính năng AI (4 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <CategoryCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
            />
          ))}
        </div>

      </main>
    </div>
  );
}