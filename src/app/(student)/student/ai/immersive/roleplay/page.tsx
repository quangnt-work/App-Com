'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Drama, ArrowRight, CheckCircle2, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { getLevelBadgeClass } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function RoleplayListPage() {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200/80 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Drama size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Giả lập tình huống (Roleplay)</h1>
            <p className="text-slate-500 text-lg">
              Hóa thân vào các tình huống giao tiếp thực tế. Áp dụng AI để cải thiện kỹ năng phản xạ.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin mb-4" />
            <p>Đang tải danh sách tình huống...</p>
          </div>
        ) : allScenarios.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-500">
            Hiện chưa có tình huống nào. Admin hãy tạo mới nhé!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {allScenarios.map((t, idx) => (
              <Link key={t.id} href={`/student/ai/immersive/roleplay/${t.id}`}>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all group flex flex-col h-full relative overflow-hidden">
                  {t.source === 'db' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-100 to-transparent opacity-50 rounded-bl-full pointer-events-none" />
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-md ${getLevelBadgeClass(t.level)}`}>
                      Cấp độ {t.level}
                    </span>
                    <span className="text-slate-400 text-sm">{t.objectives?.length || 0} mục tiêu</span>
                    {t.isDone && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle size={12} /> Đã làm
                      </span>
                    )}
                    {t.source === 'db' && !t.isDone && (
                       <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 ml-auto flex items-center gap-1">
                         <Sparkles size={12} /> MỚI
                       </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {idx + 1}. {t.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3">{t.context}</p>

                  <div className="flex items-center justify-between border-t border-slate-100 border-dashed pt-4 mt-auto">
                    <div className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                      <CheckCircle2 size={16} /> Bắt đầu ngay
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-500 shrink-0">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
