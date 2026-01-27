// src/services/user.service.ts
import { createClient } from '@/lib/supabase/server';
import { differenceInMinutes } from 'date-fns';

export async function getUserDetail(userId: string) {
  const supabase = await createClient();

  // 1. Sử dụng Promise.all để fetch song song (Tối ưu hiệu năng)
  const [profileRes, submissionRes, practiceRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('exam_submissions').select('*, exams(title)').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('user_practice_progress').select('*, practice_sets(title, skill, level)').eq('user_id', userId).order('last_accessed_at', { ascending: false })
  ]);

  const profile = profileRes.data;
  if (!profile) return null;

  // 2. Xử lý logic format dữ liệu tại đây
  const submissions = (submissionRes.data || []).map((sub) => ({
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

  // 3. Logic tính toán thống kê (Skill Stats)
  const practiceList = practiceRes.data || [];
  const skillMap = new Map<string, { total: number; count: number }>();
  
  practiceList.forEach((p) => {
    const skill = p.practice_sets?.skill || 'other';
    const current = skillMap.get(skill) || { total: 0, count: 0 };
    skillMap.set(skill, { total: current.total + p.score, count: current.count + 1 });
  });

  const skillStats = Array.from(skillMap.entries()).map(([skill, val]) => ({
    skill,
    averageScore: Number((val.total / val.count).toFixed(1)),
    totalPractices: val.count,
  }));

  // 4. Tính điểm trung bình tổng
  const avgExamScore = submissions.length > 0
    ? submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length
    : 0;

  return {
    profile,
    submissions,
    practiceList, // Bạn có thể map lại nếu cần
    stats: {
      skillStats,
      avgExamScore,
      totalExam: submissions.length,
      totalPractice: practiceList.length
    }
  };
}