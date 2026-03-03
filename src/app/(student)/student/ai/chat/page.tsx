// src/app/(student)/student/ai/chat/page.tsx
import React from 'react';
import { 
  MessageCircle, 
  Users, 
  Plane, 
  ShoppingBag, 
  HeartPulse, 
  Briefcase 
} from 'lucide-react';
import { ChatTopic } from '@/types/ai-chat';
import { ChatTopicCard } from '@/components/student/ai/chat/ChatTopicCard';

export default function AIChatPage() {
  const topics: ChatTopic[] = [
    {
      id: 'social',
      title: 'Xã giao & Đời sống',
      description: 'Kết nối và duy trì quan hệ',
      icon: <Users size={28} />,
      themeColor: {
        bg: 'bg-[#f0fdf4]',
        iconBg: 'bg-white',
        iconColor: 'text-emerald-500',
        border: 'border-emerald-100'
      },
      href: '/student/ai/chat/social'
    },
    {
      id: 'travel',
      title: 'Du lịch & Di chuyển',
      description: 'Sân bay, khách sạn, đi lại',
      icon: <Plane size={28} />,
      themeColor: {
        bg: 'bg-[#f0f9ff]',
        iconBg: 'bg-white',
        iconColor: 'text-sky-500',
        border: 'border-sky-100'
      },
      href: '/student/ai/chat/travel'
    },
    {
      id: 'service',
      title: 'Dịch vụ & Mua sắm',
      description: 'Nhà hàng, mua sắm, ngân hàng',
      icon: <ShoppingBag size={28} />,
      themeColor: {
        bg: 'bg-[#faf5ff]',
        iconBg: 'bg-white',
        iconColor: 'text-purple-500',
        border: 'border-purple-100'
      },
      href: '/student/ai/chat/service'
    },
    {
      id: 'health',
      title: 'Sức khỏe & Khẩn cấp',
      description: 'Bệnh viện, hiệu thuốc, cấp cứu',
      icon: <HeartPulse size={28} />,
      themeColor: {
        bg: 'bg-[#fef2f2]',
        iconBg: 'bg-white',
        iconColor: 'text-red-500',
        border: 'border-red-100'
      },
      href: '/student/ai/chat/health'
    },
    {
      id: 'work',
      title: 'Học tập & Công việc',
      description: 'Trường học và công sở',
      icon: <Briefcase size={28} />,
      themeColor: {
        bg: 'bg-[#fffaf0]',
        iconBg: 'bg-white',
        iconColor: 'text-orange-500',
        border: 'border-orange-100'
      },
      href: '/student/ai/chat/work'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      <main className="container mx-auto px-4 py-10 max-w-[1000px]">
        
        {/* Banner GIAO TIẾP AI */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-12 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase mb-4">
                Giao tiếp AI
              </h1>
                <p className="text-white/90 text-sm md:text-base font-medium">
                Luyện tập trò chuyện tiếng Nga cùng trí tuệ nhân tạo
                </p>
            </div>
            <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                <MessageCircle size={48} strokeWidth={2.5} />
            </div>
        </div>

        {/* Danh sách chủ đề (Dạng danh sách dọc) */}
        <div className="space-y-4 md:space-y-6">
          {topics.map((topic) => (
            <ChatTopicCard key={topic.id} topic={topic} />
          ))}
        </div>

        {/* Footer gợi ý */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 font-medium">
            Bạn cần chủ đề khác?{' '}
            <button className="text-[#f07b32] hover:underline font-bold transition-all">
              Gợi ý cho chúng tôi
            </button>
          </p>
        </div>

      </main>
    </div>
  );
}