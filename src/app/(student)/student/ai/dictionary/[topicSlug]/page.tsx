import { createClient } from '@/lib/supabase/server';
import DictionaryDetailClient from './DictionaryDetailClient';
import { DictionaryWord } from '@/types/dictionary';

export default async function DictionaryTopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const topicSlug = resolvedParams.topicSlug;

  // Lấy danh sách từ vựng từ Supabase
  const { data: words, error } = await supabase
    .from('dictionary_words' as never)
    .select('*')
    .eq('topic_slug', topicSlug)
    .order('created_at', { ascending: true })
    .returns<DictionaryWord[]>();

  if (error || !words || words.length === 0) {
    return <div className="p-10 text-center text-gray-500">Chưa có dữ liệu cho chủ đề này.</div>;
  }

  // Tên chủ đề (Giả lập map từ slug ra text, bạn có thể truyền từ db nếu muốn)
  const topicNames: Record<string, string> = {
    'greeting': 'Chào hỏi & Giới thiệu',
    'family': 'Gia đình & Bạn bè',
    // ...
  };

  return <DictionaryDetailClient words={words} topicName={topicNames[topicSlug] || 'Từ vựng'} />;
}