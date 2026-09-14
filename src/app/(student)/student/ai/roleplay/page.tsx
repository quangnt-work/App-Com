// src/app/(student)/student/ai/roleplay/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Drama, Loader2 } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { getLevelBadgeClass } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { HeroBanner } from '@/components/common/HeroBanner';
import { TopicCard } from '@/components/student/ai/TopicCard';
import { Pagination } from '@/components/common/Pagination';

function RoleplayContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = 8;

  const [dynamicScenarios, setDynamicScenarios] = useState<any[]>([]);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const [scenariosResult, historyResult] = await Promise.all([
        supabase.from('roleplay_scenarios').select('id, title, level, context, objectives').order('created_at', { ascending: false }),
        supabase.from('roleplay_history').select('scenario_id').eq('user_id', user?.id || '')
      ]);
      
      if (scenariosResult.data && !scenariosResult.error) {
        setDynamicScenarios(scenariosResult.data);
      }
      
      if (historyResult.data) {
        setCompletedScenarios(new Set(historyResult.data.map(h => h.scenario_id)));
      }
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getLevelString = (level: number) => {
    switch(level) {
      case 1: return 'A1';
      case 2: return 'A2';
      case 3: return 'B1';
      case 4: return 'B2';
      default: return 'C1';
    }
  };

  const validJsonScenarios = roleplayData.map(t => ({
    id: t.id,
    title: t.title,
    level: typeof t.level === 'number' ? getLevelString(t.level) : t.level,
    context: t.context,
    objectives: t.objectives,
    source: 'json',
    isDone: completedScenarios.has(t.id)
  }));

  const validDbScenarios = dynamicScenarios.map(t => ({
    ...t,
    source: 'db',
    isDone: completedScenarios.has(t.id)
  }));

  const allScenarios = [...validJsonScenarios, ...validDbScenarios];
  allScenarios.sort((a, b) => a.level.localeCompare(b.level));

  const totalPages = Math.ceil(allScenarios.length / pageSize);
  const currentScenarios = allScenarios.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80">
        <Loader2 size={32} className="animate-spin mb-4 text-violet-600" />
        <p className="text-sm font-medium">Đang tải danh sách tình huống...</p>
      </div>
    );
  }

  if (allScenarios.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-10 text-center rounded-2xl border border-slate-200/80 text-slate-500 shadow-xs">
        Hiện chưa có tình huống nào. Admin hãy tạo mới nhé!
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Grid danh sách 2 cột x 3 hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {currentScenarios.map((t, idx) => (
          <TopicCard
            key={t.id}
            title={t.title}
            subtitle={t.context}
            icon={<Drama size={22} strokeWidth={2.2} />}
            href={`/student/ai/roleplay/${t.id}`}
            badge={`Cấp độ ${t.level}`}
            badgeClass={getLevelBadgeClass(t.level)}
            detail={`${t.objectives?.length || 0} mục tiêu`}
            isDone={t.isDone}
            isNew={t.source === 'db' && !t.isDone}
            index={(currentPage - 1) * pageSize + idx + 1}
            colorScheme="purple"
          />
        ))}
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

export default function RoleplayListPage() {
  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner GIẢ LẬP TÌNH HUỐNG - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="GIẢ LẬP TÌNH HUỐNG (ROLEPLAY)"
          ruTitle="СИТУАЦИИ И РОЛИ"
          description="Hóa thân vào các tình huống giao tiếp đời sống thực tế tại Nga. Rèn luyện phản xạ đối thoại bằng giọng nói cùng trợ lý AI."
          icon={Drama}
          gradient="from-violet-700 via-purple-600 to-indigo-700"
        />

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80">
            <Loader2 size={32} className="animate-spin mb-4 text-violet-600" />
            <p className="text-sm font-medium">Đang tải danh sách tình huống...</p>
          </div>
        }>
          <RoleplayContent />
        </Suspense>
      </div>
    </div>
  );
}
