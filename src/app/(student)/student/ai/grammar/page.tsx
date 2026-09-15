// src/app/(student)/student/ai/grammar/page.tsx
import React from 'react';
import {
  BookOpenCheck,
  Users,
  Plane,
  ShoppingBag,
  HeartPulse,
  Briefcase
} from 'lucide-react';
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard';
import { HeroBanner } from '@/components/common/HeroBanner';
import { Pagination } from '@/components/common/Pagination';

interface GrammarPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function GrammarTopicsPage({ searchParams }: GrammarPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  // Dùng 5 chủ đề Ngữ pháp AI với thiết kế chuẩn hóa
  const allTopics: TopicCardProps[] = [
    {
      title: 'Xã giao & Đời sống',
      subtitle: 'Приветствие и Знакомство',
      description: 'Ngữ pháp giao tiếp và quy tắc đặt câu hàng ngày',
      detail: '20 câu hỏi',
      icon: <Users size={22} strokeWidth={2.2} />,
      colorScheme: 'emerald',
      href: '/student/ai/grammar/social'
    },
    {
      title: 'Du lịch & Di chuyển',
      subtitle: 'Путешествия и Транспорт',
      description: 'Cấu trúc câu chỉ hướng, địa điểm và phương tiện',
      detail: '20 câu hỏi',
      icon: <Plane size={22} strokeWidth={2.2} />,
      colorScheme: 'cyan',
      href: '/student/ai/grammar/travel'
    },
    {
      title: 'Dịch vụ & Mua sắm',
      subtitle: 'Услуги и Покупки',
      description: 'Câu mệnh lệnh, yêu cầu lịch sự và so sánh giá',
      detail: '20 câu hỏi',
      icon: <ShoppingBag size={22} strokeWidth={2.2} />,
      colorScheme: 'purple',
      href: '/student/ai/grammar/service'
    },
    {
      title: 'Sức khỏe & Khẩn cấp',
      subtitle: 'Здоровье и Безопасность',
      description: 'Thể bị động, câu điều kiện và diễn đạt triệu chứng',
      detail: '20 câu hỏi',
      icon: <HeartPulse size={22} strokeWidth={2.2} />,
      colorScheme: 'rose',
      href: '/student/ai/grammar/health'
    },
    {
      title: 'Học tập & Công việc',
      subtitle: 'Учеба и Работа',
      description: 'Ngữ pháp học thuật, mẫu câu trao đổi công sở',
      detail: '20 câu hỏi',
      icon: <Briefcase size={22} strokeWidth={2.2} />,
      colorScheme: 'orange',
      href: '/student/ai/grammar/work'
    }
  ];

  const totalPages = Math.ceil(allTopics.length / pageSize);
  const currentTopics = allTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner NGỮ PHÁP AI - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="NGỮ PHÁP AI"
          ruTitle="ГРАММАТИКА ИИ"
          description="Luyện tập ngữ pháp tiếng Nga với 20 câu trắc nghiệm AI tạo tự động theo chủ đề. Mỗi lần làm bài là một bộ câu hỏi mới!"
          icon={BookOpenCheck}
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
