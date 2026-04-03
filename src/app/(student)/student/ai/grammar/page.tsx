// src/app/(student)/student/ai/grammar/page.tsx
// Trang chọn chủ đề Ngữ pháp AI — layout giống Giao tiếp AI
import React from 'react';
import {
  BookOpenCheck,
  Users,
  Plane,
  ShoppingBag,
  HeartPulse,
  Briefcase
} from 'lucide-react';
import { ChatTopic } from '@/types/ai-chat';
import { ChatTopicCard } from '@/components/student/ai/chat/ChatTopicCard';

export default function GrammarTopicsPage() {
  // Dùng cùng 5 chủ đề như Giao tiếp AI
  const topics: ChatTopic[] = [
    {
      id: 'social',
      title: 'Xã giao & Đời sống',
      description: 'Ngữ pháp giao tiếp hàng ngày',
      icon: <Users size={28} />,
      themeColor: {
        bg: 'bg-[#f0fdf4]',
        iconBg: 'bg-white',
        iconColor: 'text-emerald-500',
        border: 'border-emerald-100'
      },
      href: '/student/ai/grammar/social'
    },
    {
      id: 'travel',
      title: 'Du lịch & Di chuyển',
      description: 'Cấu trúc câu khi đi du lịch',
      icon: <Plane size={28} />,
      themeColor: {
        bg: 'bg-[#f0f9ff]',
        iconBg: 'bg-white',
        iconColor: 'text-sky-500',
        border: 'border-sky-100'
      },
      href: '/student/ai/grammar/travel'
    },
    {
      id: 'service',
      title: 'Dịch vụ & Mua sắm',
      description: 'Câu mệnh lệnh, yêu cầu, so sánh',
      icon: <ShoppingBag size={28} />,
      themeColor: {
        bg: 'bg-[#faf5ff]',
        iconBg: 'bg-white',
        iconColor: 'text-purple-500',
        border: 'border-purple-100'
      },
      href: '/student/ai/grammar/service'
    },
    {
      id: 'health',
      title: 'Sức khỏe & Khẩn cấp',
      description: 'Thể bị động, câu điều kiện',
      icon: <HeartPulse size={28} />,
      themeColor: {
        bg: 'bg-[#fef2f2]',
        iconBg: 'bg-white',
        iconColor: 'text-red-500',
        border: 'border-red-100'
      },
      href: '/student/ai/grammar/health'
    },
    {
      id: 'work',
      title: 'Học tập & Công việc',
      description: 'Ngữ pháp học thuật, công sở',
      icon: <Briefcase size={28} />,
      themeColor: {
        bg: 'bg-[#fffaf0]',
        iconBg: 'bg-white',
        iconColor: 'text-orange-500',
        border: 'border-orange-100'
      },
      href: '/student/ai/grammar/work'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      <main className="container mx-auto px-4 py-10 max-w-[1000px]">

        {/* Banner NGỮ PHÁP AI */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-12 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase mb-4">
              Ngữ pháp AI
            </h1>
            <p className="text-white/90 text-sm md:text-base font-medium">
              Luyện tập ngữ pháp tiếng Nga với 20 câu trắc nghiệm AI tạo tự động theo chủ đề. Mỗi lần làm bài là một bộ câu hỏi hoàn toàn mới!
            </p>
          </div>
          <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white/10 backdrop-blur-sm">
            <BookOpenCheck size={48} strokeWidth={2.5} />
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Danh sách chủ đề */}
        <div className="space-y-4 md:space-y-6">
          {topics.map((topic) => (
            <ChatTopicCard key={topic.id} topic={topic} />
          ))}
        </div>

      </main>
    </div>
  );
}
