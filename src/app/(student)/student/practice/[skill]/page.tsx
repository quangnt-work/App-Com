import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PracticeList } from '@/components/student/practice/PracticeList';
import { PracticeSetWithProgress } from '@/types/practice';

interface PageProps {
  params: Promise<{ skill: string }>; // Next.js 15: params là Promise
}

export default async function PracticeSkillPage({ params }: PageProps) {
  const supabase = await createClient();
  const { skill } = await params; // Unwrapping params

  // Validate skill có hợp lệ không
  const validSkills = ['listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary'];
  if (!validSkills.includes(skill.toLowerCase())) {
    return notFound();
  }

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Query bài tập theo skill
  const { data: practiceSets } = await supabase
    .from('practice_sets')
    .select('*')
    .eq('is_published', true)
    .ilike('skill', skill) // ilike để không phân biệt hoa thường
    .order('created_at', { ascending: false });

  // 3. Query tiến độ user
  const { data: userProgress } = await supabase
    .from('user_practice_progress')
    .select('*')
    .eq('user_id', user?.id || '');

  // 4. Map dữ liệu
  const progressMap = new Map();
  userProgress?.forEach(p => progressMap.set(p.practice_set_id, p));

  const formattedData: PracticeSetWithProgress[] = (practiceSets || []).map(set => ({
    ...set,
    progress: progressMap.get(set.id) || null
  }));

  // Capitalize title for display
  const displayTitle = skill.charAt(0).toUpperCase() + skill.slice(1);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 pt-6">
        
        {/* Header trang con */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kỹ năng: {displayTitle}</h1>
            <p className="text-gray-500 mt-1">Danh sách các bài luyện tập {displayTitle}.</p>
          </div>
        </div>

        {/* Hiển thị danh sách (Grid Cards) */}
        <PracticeList initialData={formattedData} />

      </div>
    </div>
  );
}