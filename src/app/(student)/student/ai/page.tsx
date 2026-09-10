// src/app/(student)/student/ai/page.tsx
import React from 'react';
import { Bot, Mic, BookOpenCheck, MessageSquare, Book, Drama } from 'lucide-react';
import { CategoryCard } from '@/components/student/features/CategoryCard';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/common/HeroBanner';

export default async function AIPracticePage() {
  // Xác thực người dùng (giống cấu trúc các trang khác của bạn)
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const features = [
    {
      title: "Luyện nói",
      description: "Cải thiện phát âm và ngữ điệu qua phản hồi thời gian thực từ AI.",
      icon: <Mic size={22} strokeWidth={2.2} />,
      href: "/student/ai/speaking",
      colorScheme: "blue" as const
    },
    {
      title: "Ngữ pháp AI",
      description: "Bài tập trắc nghiệm thông minh nắm vững cấu trúc ngữ pháp Nga.",
      icon: <BookOpenCheck size={22} strokeWidth={2.2} />,
      href: "/student/ai/grammar",
      colorScheme: "indigo" as const
    },
    {
      title: "Giao tiếp AI",
      description: "Trò chuyện tự nhiên với trợ lý ảo đa dạng chủ đề đời sống.",
      icon: <MessageSquare size={22} strokeWidth={2.2} />,
      href: "/student/ai/chat",
      colorScheme: "teal" as const
    },
    {
      title: "Từ điển AI",
      description: "Tra cứu từ vựng thông minh với ngữ cảnh và ví dụ sinh động.",
      icon: <Book size={22} strokeWidth={2.2} />,
      href: "/student/ai/dictionary",
      colorScheme: "orange" as const
    },
    {
      title: "Nhập vai & Phản xạ",
      description: "Giả lập tình huống thực tế và luyện nhại giọng tốc độ cao.",
      icon: <Drama size={22} strokeWidth={2.2} />,
      href: "/student/ai/immersive",
      colorScheme: "indigo" as const
    }
  ];

  return (
    <div className="container mx-auto px-4 py-2 max-w-6xl font-sans">
      {/* Compact Header AI */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-xs shadow-indigo-500/20">
            <Bot size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Luyện tập cùng AI
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                ИИ Студия
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Nâng tầm kỹ năng tiếng Nga với 5 công cụ trí tuệ nhân tạo thế hệ mới
            </p>
          </div>
        </div>
      </div>

      {/* Grid tính năng AI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {features.map((feature, index) => (
          <CategoryCard 
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            href={feature.href}
            colorScheme={feature.colorScheme}
          />
        ))}
      </div>
    </div>
  );
}