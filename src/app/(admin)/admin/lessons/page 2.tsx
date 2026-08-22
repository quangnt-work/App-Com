//src/app/(admin)/admin/lessons/page.tsx

import { BookOpen, Headphones, PlayCircle, Settings } from 'lucide-react';
import LessonCard, { LessonCardProps } from '@/components/admin/lessons/LessonCard';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLessonsPage() {
  const supabase = await createClient();

  // Fetch số lượng thực từ DB
  const [
    { count: grammarCount },
    { count: audioCount },
    { count: videoCount },
  ] = await Promise.all([
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'file'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'audio'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'video'),
  ]);

  const lessonCategories: LessonCardProps[] = [
    {
      title: 'QUẢN LÝ NGỮ PHÁP',
      count: grammarCount ?? 0,
      icon: BookOpen,
      href: '/admin/lessons/grammars',
    },
    {
      title: 'QUẢN LÝ NGHE',
      count: audioCount ?? 0,
      icon: Headphones,
      href: '/admin/lessons/audios',
    },
    {
      title: 'QUẢN LÝ VIDEO',
      count: videoCount ?? 0,
      icon: PlayCircle,
      href: '/admin/lessons/videos',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Banner Tiêu đề */}
        <div className="bg-[#f97316] rounded-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
          <div className="flex items-center gap-4">
            <BookOpen size={40} className="opacity-90" />
            <h1 className="text-3xl font-bold tracking-wide">QUẢN LÝ BÀI HỌC</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-orange-100">
            <span>Trang quản trị nội dung</span>
            <Settings size={20} className="animate-spin-slow" />
          </div>
        </div>

        {/* Grid chứa các thẻ (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessonCategories.map((category, index) => (
            <LessonCard
              key={index}
              title={category.title}
              count={category.count}
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
