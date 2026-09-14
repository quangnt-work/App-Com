// src/app/(student)/student/ai/page.tsx
import React from 'react';
import { Bot, Mic, BookOpenCheck, MessageSquare, Book, Drama, Mic2 } from 'lucide-react';
import { CategoryCard } from '@/components/student/features/CategoryCard';
import { HeroBanner } from '@/components/common/HeroBanner';

export default function AIPracticePage() {
  const features = [
    {
      title: "Luyện nói",
      ruTitle: "ГОВОРЕНИЕ",
      description: "Cải thiện phát âm và ngữ điệu qua phản hồi thời gian thực từ AI.",
      icon: <Mic size={28} strokeWidth={2.2} />,
      href: "/student/ai/speaking",
      colorScheme: "blue" as const,
      buttonLabel: "Bắt đầu",
    },
    {
      title: "Ngữ pháp AI",
      ruTitle: "ГРАММАТИКА ИИ",
      description: "Bài tập trắc nghiệm thông minh nắm vững cấu trúc ngữ pháp Nga.",
      icon: <BookOpenCheck size={28} strokeWidth={2.2} />,
      href: "/student/ai/grammar",
      colorScheme: "indigo" as const,
      buttonLabel: "Bắt đầu",
    },
    {
      title: "Giao tiếp AI",
      ruTitle: "ДИАЛОГ ИИ",
      description: "Trò chuyện tự nhiên với trợ lý ảo đa dạng chủ đề đời sống.",
      icon: <MessageSquare size={28} strokeWidth={2.2} />,
      href: "/student/ai/chat",
      colorScheme: "teal" as const,
      buttonLabel: "Bắt đầu",
    },
    {
      title: "Từ điển AI",
      ruTitle: "СЛОВАРЬ",
      description: "Tra cứu từ vựng thông minh với ngữ cảnh và ví dụ sinh động.",
      icon: <Book size={28} strokeWidth={2.2} />,
      href: "/student/ai/dictionary",
      colorScheme: "orange" as const,
      buttonLabel: "Khám phá",
    },
    {
      title: "Luyện nhại giọng",
      ruTitle: "СЛУШАЙ И ПОВТОРЯЙ",
      description: "Luyện phản xạ nghe và lặp lại lập tức (Blind Mode), bứt phá phát âm chuẩn xác.",
      icon: <Mic2 size={28} strokeWidth={2.2} />,
      href: "/student/ai/shadowing",
      colorScheme: "indigo" as const,
      buttonLabel: "Bắt đầu",
    },
    {
      title: "Giả lập tình huống",
      ruTitle: "СИТУАЦИИ И РОЛИ",
      description: "Hóa thân vào các tình huống đời sống thực tế, đối thoại giọng nói vượt qua thử thách.",
      icon: <Drama size={28} strokeWidth={2.2} />,
      href: "/student/ai/roleplay",
      colorScheme: "purple" as const,
      buttonLabel: "Bắt đầu",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col">
      {/* Banner Title AI - Đồng bộ thiết kế & kích thước */}
      <HeroBanner
        title="LUYỆN TẬP CÙNG AI"
        ruTitle="ИИ СТУДИЯ"
        description="Nâng tầm toàn diện kỹ năng tiếng Nga với 6 công cụ trí tuệ nhân tạo chuyên sâu thế hệ mới."
        icon={Bot}
        gradient="from-indigo-700 via-violet-600 to-purple-700"
      />

      {/* Grid 6 tính năng AI - Lưới 3 cột x 2 hàng cân đối trong max-w-6xl */}
      <div className="flex-1 flex flex-col justify-center my-auto pt-2 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-4.5">
          {features.map((feature, index) => (
            <CategoryCard 
              key={index}
              title={feature.title}
              ruTitle={feature.ruTitle}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              colorScheme={feature.colorScheme}
              buttonLabel={feature.buttonLabel}
              compact={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}