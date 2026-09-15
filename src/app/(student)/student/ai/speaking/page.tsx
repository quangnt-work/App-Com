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
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard';
import { HeroBanner } from '@/components/common/HeroBanner';
import { Pagination } from '@/components/common/Pagination';

interface SpeakingPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SpeakingTopicsPage({ searchParams }: SpeakingPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  // Dữ liệu danh sách 8 chủ đề luyện nói
  const allTopics: TopicCardProps[] = [
    {
      title: "Chào hỏi & Giới thiệu",
      subtitle: "Привет и Знакомство",
      description: "Phát âm từ vựng và câu giao tiếp cơ bản",
      detail: "Luyện phát âm",
      icon: <Users size={22} strokeWidth={2.2} />,
      colorScheme: "blue",
      href: "/student/ai/speaking/greeting"
    },
    {
      title: "Gia đình & Bạn bè",
      subtitle: "Семья и Друзья",
      description: "Xưng hô, giới thiệu thành viên gia đình và người thân",
      detail: "Luyện phát âm",
      icon: <Heart size={22} strokeWidth={2.2} />,
      colorScheme: "rose",
      href: "/student/ai/speaking/family"
    },
    {
      title: "Số, Thời gian & Ngày",
      subtitle: "Числа, Время и Даты",
      description: "Luyện đếm số, nói giờ giấc và ngày tháng",
      detail: "Luyện phát âm",
      icon: <Clock size={22} strokeWidth={2.2} />,
      colorScheme: "orange",
      href: "/student/ai/speaking/numbers-time"
    },
    {
      title: "Nhà cửa & Đồ đạc",
      subtitle: "Дом и Мебель",
      description: "Mô tả không gian sống, đồ dùng trong phòng",
      detail: "Luyện phát âm",
      icon: <Home size={22} strokeWidth={2.2} />,
      colorScheme: "emerald",
      href: "/student/ai/speaking/house"
    },
    {
      title: "Thức ăn & Đồ uống",
      subtitle: "Еда и Напитки",
      description: "Gọi món, gọi đồ uống và món ăn Nga phổ biến",
      detail: "Luyện phát âm",
      icon: <Utensils size={22} strokeWidth={2.2} />,
      colorScheme: "orange",
      href: "/student/ai/speaking/food"
    },
    {
      title: "Sinh hoạt hàng ngày",
      subtitle: "Распорядок дня",
      description: "Thói quen hàng ngày, lịch trình và hoạt động cá nhân",
      detail: "Luyện phát âm",
      icon: <Sun size={22} strokeWidth={2.2} />,
      colorScheme: "cyan",
      href: "/student/ai/speaking/daily-routine"
    },
    {
      title: "Quần áo & Màu sắc",
      subtitle: "Одежда и Цвета",
      description: "Mô tả trang phục, phong cách và bảng màu sắc",
      detail: "Luyện phát âm",
      icon: <Shirt size={22} strokeWidth={2.2} />,
      colorScheme: "purple",
      href: "/student/ai/speaking/clothes"
    },
    {
      title: "Phương tiện & Đi lại",
      subtitle: "Транспорт и Путешествия",
      description: "Hỏi đường, đi lại bằng xe buýt, metro, taxi",
      detail: "Luyện phát âm",
      icon: <Car size={22} strokeWidth={2.2} />,
      colorScheme: "slate",
      href: "/student/ai/speaking/transport"
    }
  ];

  const totalPages = Math.ceil(allTopics.length / pageSize);
  const currentTopics = allTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner LUYỆN NÓI - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="LUYỆN NÓI CÙNG AI"
          ruTitle="ГОВОРЕНИЕ"
          description="Cải thiện khả năng phát âm và phản xạ giao tiếp tiếng Nga với trợ lý AI thông minh theo từng chủ đề."
          icon={Mic}
          gradient="from-indigo-700 via-violet-600 to-purple-700"
        />

        {/* Grid Danh sách Chủ đề */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {currentTopics.map((topic, index) => (
            <TopicCard 
              key={topic.href} 
              {...topic} 
              index={(currentPage - 1) * pageSize + index + 1} 
            />
          ))}
        </div>
      </div>

      {/* Phân trang cố định sát Footer */}
      {totalPages > 1 && (
        <div className="mt-auto pt-3 pb-1 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}