// src/app/(student)/student/ai/immersive/shadowing/page.tsx
import React from 'react';
import Link from 'next/link';
import { Mic2, ArrowRight, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getLevelBadgeClass } from '@/lib/utils';
import shadowingData from '@/data/shadowing.json';

export default async function ShadowingListPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: dbTopics, error } = await supabase
    .from('shadowing_topics')
    .select('*, shadowing_sentences(id)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading shadowing topics:', error);
  }

  // Lấy lịch sử để kiểm tra chủ đề nào đã học
  const { data: historyData } = await supabase
    .from('shadowing_history')
    .select('topic_id')
    .eq('user_id', user?.id || '');

  const completedTopicIds = new Set((historyData || []).map(h => h.topic_id));

  // Kết hợp data cũ từ JSON và data mới từ DB
  const validDbTopics = (dbTopics || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    level: t.level,
    description: t.description,
    sentenceCount: t.shadowing_sentences?.length || 0,
    source: 'db',
    isDone: completedTopicIds.has(t.id)
  }));

  const getLevelString = (level: number) => {
    switch(level) {
      case 1: return 'A1';
      case 2: return 'A2';
      case 3: return 'B1';
      case 4: return 'B2';
      default: return 'C1';
    }
  };

  const validJsonTopics = shadowingData.map(t => ({
    id: t.id,
    title: t.title,
    level: typeof t.level === 'number' ? getLevelString(t.level) : t.level,
    description: (t as any).description,
    sentenceCount: t.sentences?.length || 0,
    source: 'json',
    isDone: completedTopicIds.has(t.id)
  }));

  const allTopics = [...validJsonTopics, ...validDbTopics];
  
  // Sắp xếp theo trình độ (A1, A2, B1, B2, C1)
  allTopics.sort((a, b) => a.level.localeCompare(b.level));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200/80 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Mic2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Luyện nhại giọng (Shadowing)</h1>
            <p className="text-slate-500 text-lg">
              Luật chơi: Bạn sẽ không được nhìn thấy văn bản (Blind Mode). Hãy dùng kỹ năng Nghe để bắt chước lại nguyên bản ngay lập tức. Sai 3 lần sẽ được xem gợi ý.
            </p>
          </div>
        </div>

        {allTopics.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-500">
            Hiện chưa có bài học nào. Admin hãy tạo bài học mới nhé!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {allTopics.map((topic: any, idx: number) => (
              <Link key={topic.id} href={`/student/ai/immersive/shadowing/${topic.id}`}>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all group flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${getLevelBadgeClass(topic.level)}`}>
                        Cấp độ {topic.level}
                      </span>
                      <span className="text-slate-400 text-sm">{topic.sentenceCount} câu</span>
                      {topic.isDone && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <CheckCircle size={12} /> Đã làm
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {idx + 1}. {topic.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors text-slate-400 shrink-0 ml-4">
                    <ArrowRight size={20} />
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
