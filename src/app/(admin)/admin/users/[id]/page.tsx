// src/app/(admin)/admin/users/[id]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, Target } from 'lucide-react';
import { getUserDetail } from '@/services/user.service'; // Import service vừa tạo

// Components (Giữ nguyên các component hiển thị)
import { UserProfileCard } from '@/components/admin/users/user-detail/UserProfileCard';
import { SubmissionTable } from '@/components/admin/users/user-detail/SubmissionTable';
import { StatCard } from '@/components/admin/users/user-detail/StatCard';
import { SkillAnalysis } from '@/components/admin/users/user-detail/SkillAnalysis';
import { PracticeTable } from '@/components/admin/users/user-detail/PracticeTable';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Gọi Service Layer (Code gọn hơn, chạy nhanh hơn nhờ Promise.all bên trong service)
  const data = await getUserDetail(id);

  if (!data || !data.profile) return notFound();

  const { profile, submissions, practiceList, stats } = data;

  // Chuẩn bị object User cho UI
  const userDisplay = {
    id: profile.id,
    name: profile.full_name || profile.username || 'User',
    email: profile.email,
    avatar: profile.avatar_url,
    role: profile.role,
    status: 'Hoạt động',
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-600 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ học tập</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* === CỘT TRÁI === */}
        <div className="xl:col-span-3 space-y-6">
          <UserProfileCard user={userDisplay} />
          <SkillAnalysis data={stats.skillStats} />
        </div>

        {/* === CỘT PHẢI === */}
        <div className="xl:col-span-9 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              label="Điểm TB (Đề thi)" 
              value={stats.avgExamScore.toFixed(1)} 
              icon={Trophy} 
              color="amber" 
            />
            <StatCard 
              label="Tổng đề đã làm" 
              value={stats.totalExam} 
              icon={BookOpen} 
              color="sky" 
            />
            <StatCard 
              label="Bài luyện tập" 
              value={stats.totalPractice} 
              icon={Target} 
              color="green" 
            />
          </div>

          {/* Tables */}
          <SubmissionTable submissions={submissions} />
          <PracticeTable practices={practiceList} />
        </div>
      </div>
    </div>
  );
}