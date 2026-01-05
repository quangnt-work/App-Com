import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, Target } from 'lucide-react';

// Components
import { UserProfileCard } from '@/components/admin/users/user-detail/UserProfileCard';
import { SubmissionTable } from '@/components/admin/users/user-detail/SubmissionTable';
import { StatCard } from '@/components/admin/users/user-detail/StatCard';
import { SkillAnalysis } from '@/components/admin/users/user-detail/SkillAnalysis'; // Mới
import { PracticeTable } from '@/components/admin/users/user-detail/PracticeTable'; // Mới

import { differenceInMinutes } from 'date-fns';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Fetch Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) return notFound();

  // 2. Fetch Exam Submissions (Kết quả thi)
  const { data: rawSubmissions } = await supabase
    .from('exam_submissions')
    .select('*, exams(title)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  // 3. Fetch Practice Progress (Kết quả luyện tập kỹ năng) - Query bảng mới tạo ở bước SQL trước
  const { data: rawPractice } = await supabase
    .from('user_practice_progress')
    .select('*, practice_sets(title, skill, level)')
    .eq('user_id', id)
    .order('last_accessed_at', { ascending: false });

  // --- Xử lý dữ liệu hiển thị ---

  // A. Format Exam List
  const submissions = (rawSubmissions || []).map((sub: any) => ({
    id: sub.id,
    examTitle: sub.exams?.title || 'Unknown Exam',
    submittedAt: sub.submitted_at || sub.created_at,
    score: sub.score,
    totalScore: sub.total_score || 10,
    duration: sub.started_at && sub.submitted_at 
        ? `${differenceInMinutes(new Date(sub.submitted_at), new Date(sub.started_at))} phút` 
        : '--',
    status: sub.status || 'pending',
  }));

  // B. Format Practice List
  const practiceList = (rawPractice || []).map((p: any) => ({
    id: p.id,
    title: p.practice_sets?.title,
    skill: p.practice_sets?.skill,
    level: p.practice_sets?.level,
    score: p.score,
    status: p.status,
    lastAccessed: p.last_accessed_at,
  }));

  // C. Tính toán Skill Stats (Gom nhóm theo skill để tính trung bình)
  const skillMap = new Map<string, { total: number; count: number }>();
  
  practiceList.forEach((p) => {
    const skill = p.skill || 'other';
    const current = skillMap.get(skill) || { total: 0, count: 0 };
    skillMap.set(skill, { total: current.total + p.score, count: current.count + 1 });
  });

  const skillStats = Array.from(skillMap.entries()).map(([skill, val]) => ({
    skill,
    averageScore: val.total / val.count,
    totalPractices: val.count,
  }));

  // D. User Object
  const user = {
    id: profile.id,
    name: profile.full_name || profile.username || 'User',
    email: profile.email,
    avatar: profile.avatar_url,
    role: profile.role,
    status: 'Hoạt động',
  };

  // Tính tổng quan
  const totalExam = submissions.length;
  const avgExamScore = totalExam > 0 
    ? submissions.reduce((acc, curr) => acc + curr.score, 0) / totalExam 
    : 0;

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users" className="inline-flex items-center text-sm text-gray-500 hover:text-sky-600 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ học tập</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* === CỘT TRÁI (Thông tin & Chỉ số Kỹ năng) - Chiếm 3/12 === */}
        <div className="xl:col-span-3 space-y-6">
          <UserProfileCard user={user} />
          
          {/* Component Phân tích kỹ năng mới */}
          <SkillAnalysis data={skillStats} />
        </div>

        {/* === CỘT PHẢI (Kết quả chi tiết) - Chiếm 9/12 === */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Điểm TB (Đề thi)" value={avgExamScore.toFixed(1)} icon={Trophy} color="amber" />
            <StatCard label="Tổng đề đã làm" value={totalExam} icon={BookOpen} color="sky" />
            <StatCard label="Bài luyện tập" value={practiceList.length} icon={Target} color="green" />
          </div>

          {/* 2. Danh sách Đề thi (Exams) */}
          <SubmissionTable submissions={submissions} />

          {/* 3. Danh sách Luyện tập (Practices) - Mới */}
          <PracticeTable practices={practiceList} />

        </div>
      </div>
    </div>
  );
}