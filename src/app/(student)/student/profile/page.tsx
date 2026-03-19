// src/app/(student)/student/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/student/profile/ProfileClient';
import { UserProfile, TestRecord, ChartDataPoint, TestCategory } from '@/types/profile';

export const metadata = {
  title: "Hồ sơ cá nhân | Hệ thống học tập",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch real profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();


  // Fetch real history
  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select(`
      id,
      created_at,
      score,
      exams (
        title,
        exam_type,
        level
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Map to TestRecord and find highest score
  let maxScore = -1;
  let highestLevel = '-';

  const history: TestRecord[] = (submissions || []).map((sub: any) => {
    const examType = sub.exams?.exam_type;
    const examLevel = sub.exams?.level || '-';
    let typeLabel: TestCategory = 'Tổng hợp';
    if (examType === 'grammar') typeLabel = 'Ngữ pháp';
    if (examType === 'reading') typeLabel = 'Đọc hiểu';
    if (examType === 'listening') typeLabel = 'Nghe hiểu';

    if (sub.score && sub.score > maxScore) {
      maxScore = sub.score;
      highestLevel = examLevel;
    }

    return {
      id: sub.id,
      date: new Date(sub.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      name: sub.exams?.title || 'Bài kiểm tra',
      type: typeLabel,
      score: sub.score || 0,
    };
  });

  const profile: UserProfile = {
    id: user.id,
    name: profileData?.full_name || user.user_metadata?.full_name || 'Học viên',
    username: profileData?.username || user.user_metadata?.username || 'HV',
    level: highestLevel, 
    email: user.email || '',
    joinDate: new Date(profileData?.created_at || user.created_at).toLocaleDateString('vi-VN'),
  };

  // Generate chart data: take up to 10 latest exams in chronological order for the chart
  const chartData: ChartDataPoint[] = [];
  const latestSubs = [...history].reverse().slice(-10); // earliest to latest
  
  latestSubs.forEach((sub, index) => {
    const cp: ChartDataPoint = { name: `T${index + 1}` };
    if (sub.type === 'Ngữ pháp') cp.grammar = sub.score;
    if (sub.type === 'Đọc hiểu') cp.reading = sub.score;
    if (sub.type === 'Nghe hiểu') cp.listening = sub.score;
    if (sub.type === 'Tổng hợp') cp.mixed = sub.score;
    chartData.push(cp);
  });

  // Luôn đảm bảo có 10 cột mốc (T1-T10) kể cả khi chưa có data
  for (let i = chartData.length; i < 10; i++) {
    chartData.push({ name: `T${i + 1}` });
  }

  return <ProfileClient profile={profile} history={history} chartData={chartData} />;
}