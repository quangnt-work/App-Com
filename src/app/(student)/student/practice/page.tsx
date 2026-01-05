import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SkillCategoryCards } from '@/components/student/practice/SkillCategoryCards';
import { PracticeStats } from '@/components/student/practice/PracticeStats'; // Nếu muốn giữ phần thống kê tổng quan

export default async function PracticePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Lấy toàn bộ bài tập (để đếm số lượng cho từng skill)
  const { data: allSets } = await supabase
    .from('practice_sets')
    .select('skill')
    .eq('is_published', true);

  // Tính toán số lượng bài cho mỗi skill
  const stats = (allSets || []).reduce((acc: Record<string, number>, curr) => {
    const key = curr.skill.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 pt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Thư viện Luyện tập</h1>
          <p className="text-gray-500 mt-2 text-lg">Chọn một kỹ năng để bắt đầu hành trình của bạn.</p>
        </div>

        {/* Chỉ hiển thị 6 thẻ Skill */}
        <SkillCategoryCards stats={stats} />
      </div>
    </div>
  );
}