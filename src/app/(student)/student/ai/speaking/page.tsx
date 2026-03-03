// src/app/(student)/student/ai/speaking/page.tsx
import React from 'react';
import { 
  Mic, 
  Users, 
  Heart, 
  Clock, 
  Home, 
  Utensils, 
  Sun, 
  Shirt, 
  Car 
} from 'lucide-react';
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard'; // Chỉnh lại đường dẫn import tùy vào cấu trúc của bạn
import { createClient } from '@/lib/supabase/server';

export default async function SpeakingTopicsPage() {
  // Xác thực (giữ nguyên logic của bạn)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Dữ liệu danh sách chủ đề theo thiết kế
  const topics: TopicCardProps[] = [
    {
      title: "Chào hỏi & Giới thiệu",
      subtitle: "Привет и Знакомство",
      icon: <Users size={24} strokeWidth={2.5} />,
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-50",
      href: "/student/ai/speaking/greeting"
    },
    {
      title: "Gia đình & Bạn bè",
      subtitle: "Семья и Друзья",
      icon: <Heart size={24} strokeWidth={2.5} />,
      borderColor: "border-red-500",
      iconColor: "text-red-500",
      iconBgColor: "bg-red-50",
      href: "/student/ai/speaking/family"
    },
    {
      title: "Số, Thời gian & Ngày",
      subtitle: "Числа, Время и Даты",
      icon: <Clock size={24} strokeWidth={2.5} />,
      borderColor: "border-orange-500",
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-50",
      href: "/student/ai/speaking/numbers-time"
    },
    {
      title: "Nhà cửa & Đồ đạc",
      subtitle: "Дом и Мебель",
      icon: <Home size={24} strokeWidth={2.5} />,
      borderColor: "border-green-500",
      iconColor: "text-green-500",
      iconBgColor: "bg-green-50",
      href: "/student/ai/speaking/house"
    },
    {
      title: "Thức ăn & Đồ uống",
      subtitle: "Еда и Напитки",
      icon: <Utensils size={24} strokeWidth={2.5} />,
      borderColor: "border-orange-600",
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
      href: "/student/ai/speaking/food"
    },
    {
      title: "Sinh hoạt hàng ngày",
      subtitle: "Распорядок дня",
      icon: <Sun size={24} strokeWidth={2.5} />,
      borderColor: "border-cyan-400",
      iconColor: "text-cyan-500",
      iconBgColor: "bg-cyan-50",
      href: "/student/ai/speaking/daily-routine"
    },
    {
      title: "Quần áo & Màu sắc",
      subtitle: "Одежда и Цвета",
      icon: <Shirt size={24} strokeWidth={2.5} />,
      borderColor: "border-purple-500",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-50",
      href: "/student/ai/speaking/clothes"
    },
    {
      title: "Phương tiện & Đi lại",
      subtitle: "Транспорт и Путешествия",
      icon: <Car size={24} strokeWidth={2.5} />,
      borderColor: "border-slate-600",
      iconColor: "text-slate-600",
      iconBgColor: "bg-slate-100",
      href: "/student/ai/speaking/transport"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Hero Banner Căn giữa */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-12 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase mb-4">
                Luyện nói cùng AI
                </h1>
                <p className="text-white/90 text-sm md:text-base font-medium">
                Cải thiện khả năng phát âm và phản xạ giao tiếp tiếng Nga với trợ lý AI thông minh theo từng chủ đề.
                </p>
            </div>
            <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white/10 backdrop-blur-sm">
                <Mic size={48} strokeWidth={2.5} />
            </div>
        </div>

        {/* Grid Danh sách Chủ đề (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {topics.map((topic, index) => (
            <TopicCard key={index} {...topic} />
          ))}
        </div>

      </main>
    </div>
  );
}