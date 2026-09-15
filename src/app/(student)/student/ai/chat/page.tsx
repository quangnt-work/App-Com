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
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard';
import { HeroBanner } from '@/components/common/HeroBanner';
import { Pagination } from '@/components/common/Pagination';

interface ChatPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function AIChatPage({ searchParams }: ChatPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  // Dùng 5 chủ đề Giao tiếp AI với thiết kế chuẩn hóa
  const allTopics: TopicCardProps[] = [
    {
      title: 'Xã giao & Đời sống',
      subtitle: 'Общение и Жизнь',
      description: 'Trò chuyện kết nối và duy trì quan hệ xã hội',
      detail: 'Hội thoại AI',
      icon: <Users size={22} strokeWidth={2.2} />,
      colorScheme: 'emerald',
      href: '/student/ai/chat/social'
    },
    {
      title: 'Du lịch & Di chuyển',
      subtitle: 'Путешествия и Поездки',
      description: 'Hỏi đường, sân bay, khách sạn và phương tiện',
      detail: 'Hội thoại AI',
      icon: <Plane size={22} strokeWidth={2.2} />,
      colorScheme: 'cyan',
      href: '/student/ai/chat/travel'
    },
    {
      title: 'Dịch vụ & Mua sắm',
      subtitle: 'Сервис и Покупки',
      description: 'Gọi món nhà hàng, mua sắm đồ đạc, giao dịch',
      detail: 'Hội thoại AI',
      icon: <ShoppingBag size={22} strokeWidth={2.2} />,
      colorScheme: 'purple',
      href: '/student/ai/chat/service'
    },
    {
      title: 'Sức khỏe & Khẩn cấp',
      subtitle: 'Здоровье и Помощь',
      description: 'Hỏi thăm tại bệnh viện, hiệu thuốc, cấp cứu',
      detail: 'Hội thoại AI',
      icon: <HeartPulse size={22} strokeWidth={2.2} />,
      colorScheme: 'rose',
      href: '/student/ai/chat/health'
    },
    {
      title: 'Học tập & Công việc',
      subtitle: 'Учеба и Работа',
      description: 'Thảo luận lớp học, trường học và công sở',
      detail: 'Hội thoại AI',
      icon: <Briefcase size={22} strokeWidth={2.2} />,
      colorScheme: 'orange',
      href: '/student/ai/chat/work'
    }
  ];

  const totalPages = Math.ceil(allTopics.length / pageSize);
  const currentTopics = allTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner GIAO TIẾP AI - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="GIAO TIẾP AI"
          ruTitle="ДИАЛОГ ИИ"
          description="Luyện tập trò chuyện tiếng Nga cùng trí tuệ nhân tạo qua các tình huống thực tế sinh động."
          icon={MessageCircle}
          gradient="from-indigo-700 via-violet-600 to-purple-700"
        />

        {/* Danh sách chủ đề (2 cột cân đối) */}
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