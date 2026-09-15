// src/app/(student)/student/ai/shadowing/page.tsx
import React from 'react';
import { Mic2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getLevelBadgeClass } from '@/lib/utils';
import shadowingData from '@/data/shadowing.json';
import { HeroBanner } from '@/components/common/HeroBanner';
import { TopicCard } from '@/components/student/ai/TopicCard';
import { Pagination } from '@/components/common/Pagination';

interface ShadowingPageProps {
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

export default async function ShadowingListPage({ searchParams }: ShadowingPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: dbTopics, error } = await supabase
    .from('shadowing_topics')
    .select('*, shadowing_sentences(id, ru, order_index)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading shadowing topics:', error);
  }

  // Lấy lịch sử để kiểm tra chủ đề nào đã học và điểm số cao nhất
  const { data: historyData } = await supabase
    .from('shadowing_history')
    .select('topic_id, score')
    .eq('user_id', user?.id || '');

  const historyScores = new Map<string, number>();
  (historyData || []).forEach(h => {
    const current = historyScores.get(h.topic_id);
    if (current === undefined || h.score > current) {
      historyScores.set(h.topic_id, h.score);
    }
  });

  const getLevelString = (level: number) => {
    switch(level) {
      case 1: return 'A1';
      case 2: return 'A2';
      case 3: return 'B1';
      case 4: return 'B2';
      default: return 'C1';
    }
  };

  // Kết hợp data cũ từ JSON và data mới từ DB
  const validDbTopics = (dbTopics || []).map((t: any) => {
    const levelStr = typeof t.level === 'number' ? getLevelString(t.level) : t.level;
    const sortedSentences = [...(t.shadowing_sentences || [])].sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const firstRu = sortedSentences[0]?.ru;
    return {
      id: t.id,
      title: t.title,
      level: levelStr,
      sampleSentence: firstRu ? `Ví dụ: "${firstRu}"` : undefined,
      description: t.description || 'Luyện phản xạ nghe và lặp lại lập tức theo phương pháp Shadowing',
      sentenceCount: t.shadowing_sentences?.length || 0,
      source: 'db',
      isDone: historyScores.has(t.id),
      bestScore: historyScores.get(t.id)
    };
  });

  const validJsonTopics = shadowingData.map(t => {
    const levelStr = typeof t.level === 'number' ? getLevelString(t.level) : t.level;
    const firstRu = t.sentences?.[0]?.ru;
    return {
      id: t.id,
      title: t.title,
      level: levelStr,
      sampleSentence: firstRu ? `Ví dụ: "${firstRu}"` : undefined,
      description: (t as any).description || 'Luyện phản xạ nghe và lặp lại lập tức theo phương pháp Shadowing',
      sentenceCount: t.sentences?.length || 0,
      source: 'json',
      isDone: historyScores.has(t.id),
      bestScore: historyScores.get(t.id)
    };
  });

  const allTopics = [...validJsonTopics, ...validDbTopics];
  
  // Sắp xếp theo trình độ chuẩn (A1 -> A2 -> B1 -> B2 -> C1)
  allTopics.sort((a, b) => compareLevels(a.level, b.level));

  const totalPages = Math.ceil(allTopics.length / pageSize);
  const currentTopics = allTopics.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner LUYỆN NHẠI GIỌNG - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="LUYỆN NHẠI GIỌNG (SHADOWING)"
          ruTitle="СЛУШАЙ И ПОВТОРЯЙ"
          description="Luyện phản xạ nghe và lặp lại lập tức (Blind Mode). Bắt chước ngữ điệu chuẩn bản xứ, nâng cấp phát âm thần tốc."
          icon={Mic2}
          gradient="from-indigo-700 via-violet-600 to-purple-700"
        />

        {allTopics.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md p-10 text-center rounded-2xl border border-slate-200/80 text-slate-500 shadow-xs">
            Hiện chưa có bài học nào. Admin hãy tạo bài học mới nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {currentTopics.map((topic: any, idx: number) => (
              <TopicCard
                key={topic.id}
                title={topic.title}
                subtitle={topic.sampleSentence}
                description={topic.description}
                icon={<Mic2 size={22} strokeWidth={2.2} />}
                href={`/student/ai/shadowing/${topic.id}`}
                badge={`Cấp độ ${topic.level}`}
                badgeClass={getLevelBadgeClass(topic.level)}
                detail={`${topic.sentenceCount} câu`}
                score={topic.bestScore !== undefined ? `${topic.bestScore}%` : undefined}
                isDone={topic.isDone}
                index={(currentPage - 1) * pageSize + idx + 1}
                colorScheme="indigo"
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
