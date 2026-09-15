// src/app/(student)/student/ai/roleplay/page.tsx
import React from 'react';
import { Drama } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { getLevelBadgeClass } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/common/HeroBanner';
import { TopicCard } from '@/components/student/ai/TopicCard';
import { Pagination } from '@/components/common/Pagination';

interface RoleplayPageProps {
  searchParams?: Promise<{ page?: string }>;
}

const LEVEL_WEIGHT: Record<string, number> = {
  'A1': 1,
  'A2': 2,
  'B1': 3,
  'B2': 4,
  'C1': 5,
  'C2': 6,
};

const compareLevels = (a: string, b: string) => {
  const weightA = LEVEL_WEIGHT[a] ?? 99;
  const weightB = LEVEL_WEIGHT[b] ?? 99;
  return weightA - weightB;
};

const getLevelString = (level: number) => {
  switch(level) {
    case 1: return 'A1';
    case 2: return 'A2';
    case 3: return 'B1';
    case 4: return 'B2';
    default: return 'C1';
  }
};

export default async function RoleplayListPage({ searchParams }: RoleplayPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const [scenariosResult, historyResult] = await Promise.all([
    supabase
      .from('roleplay_scenarios')
      .select('id, title, level, context, ai_role, objectives')
      .order('created_at', { ascending: false }),
    supabase
      .from('roleplay_history')
      .select('scenario_id, completed_objectives, total_objectives')
      .eq('user_id', user?.id || '')
  ]);

  const dynamicScenarios = scenariosResult.data || [];
  const historyMap = new Map<string, { completedCount: number; totalCount: number }>();
  
  (historyResult.data || []).forEach(h => {
    const completedCount = h.completed_objectives?.length || 0;
    const totalCount = h.total_objectives || 0;
    const existing = historyMap.get(h.scenario_id);
    if (!existing || completedCount > existing.completedCount) {
      historyMap.set(h.scenario_id, { completedCount, totalCount });
    }
  });

  const validJsonScenarios = roleplayData.map(t => {
    const levelStr = typeof t.level === 'number' ? getLevelString(t.level) : t.level;
    const history = historyMap.get(t.id);
    const totalObj = t.objectives?.length || 0;
    const scoreText = history ? `${history.completedCount}/${totalObj} mục tiêu` : undefined;

    return {
      id: t.id,
      title: t.title,
      level: levelStr,
      aiRole: t.ai_role ? `🎭 Đối thoại: ${t.ai_role}` : undefined,
      context: t.context,
      objectivesCount: totalObj,
      source: 'json',
      isDone: historyMap.has(t.id),
      score: scoreText
    };
  });

  const validDbScenarios = dynamicScenarios.map((t: any) => {
    const levelStr = typeof t.level === 'number' ? getLevelString(t.level) : t.level;
    const history = historyMap.get(t.id);
    const totalObj = Array.isArray(t.objectives) ? t.objectives.length : 0;
    const scoreText = history ? `${history.completedCount}/${totalObj} mục tiêu` : undefined;

    return {
      id: t.id,
      title: t.title,
      level: levelStr,
      aiRole: t.ai_role ? `🎭 Đối thoại: ${t.ai_role}` : undefined,
      context: t.context,
      objectivesCount: totalObj,
      source: 'db',
      isDone: historyMap.has(t.id),
      score: scoreText
    };
  });

  const allScenarios = [...validJsonScenarios, ...validDbScenarios];
  allScenarios.sort((a, b) => compareLevels(a.level, b.level));

  const totalPages = Math.ceil(allScenarios.length / pageSize);
  const currentScenarios = allScenarios.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner GIẢ LẬP TÌNH HUỐNG - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="GIẢ LẬP TÌNH HUỐNG (ROLEPLAY)"
          ruTitle="СИТУAЦИИ И РОЛИ"
          description="Hóa thân vào các tình huống giao tiếp đời sống thực tế tại Nga. Rèn luyện phản xạ đối thoại bằng giọng nói cùng trợ lý AI."
          icon={Drama}
          gradient="from-violet-700 via-purple-600 to-indigo-700"
        />

        {allScenarios.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md p-10 text-center rounded-2xl border border-slate-200/80 text-slate-500 shadow-xs">
            Hiện chưa có tình huống nào. Admin hãy tạo mới nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {currentScenarios.map((t, idx) => (
              <TopicCard
                key={t.id}
                title={t.title}
                subtitle={t.aiRole}
                description={t.context}
                icon={<Drama size={22} strokeWidth={2.2} />}
                href={`/student/ai/roleplay/${t.id}`}
                badge={`Cấp độ ${t.level}`}
                badgeClass={getLevelBadgeClass(t.level)}
                detail={`${t.objectivesCount} mục tiêu`}
                score={t.score}
                isDone={t.isDone}
                isNew={t.source === 'db' && !t.isDone}
                index={(currentPage - 1) * pageSize + idx + 1}
                colorScheme="purple"
              />
            ))}
          </div>
        )}
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
