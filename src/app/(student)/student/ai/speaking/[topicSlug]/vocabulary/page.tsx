// src/app/(student)/student/ai/speaking/[topicSlug]/vocabulary/page.tsx

import { createClient } from '@/lib/supabase/server';
import VocabularyPracticeClient from './VocabularyPracticeClient'; 
import { DictionaryWord } from '@/types/dictionary';

export default async function VocabularySpeakingPage({ 
  params 
}: { 
  params: Promise<{ topicSlug: string }> 
}) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const topicSlug = resolvedParams.topicSlug;

  const { data: rawData, error } = await supabase
    .from('dictionary_words')
    .select('*')
    .eq('topic_slug', topicSlug)
    .limit(20);

  if (error) {
    console.error("Lỗi fetch dữ liệu từ vựng:", error);
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500">
        Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.
      </div>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Chủ đề này chưa có từ vựng nào.
      </div>
    );
  }

  // Ép kiểu (Type Assertion) bằng unknown trung gian để TypeScript không báo lỗi
  // Đây là cách an toàn khi bạn chắc chắn cấu trúc Database khớp với Interface
  const vocabularies = rawData as unknown as DictionaryWord[];

  return <VocabularyPracticeClient vocabularies={vocabularies} topicName={topicSlug} />;
}