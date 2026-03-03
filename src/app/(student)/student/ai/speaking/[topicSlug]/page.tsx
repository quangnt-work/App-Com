import { createClient } from '@/lib/supabase/server';
import SpeakingPracticeClient from './SpeakingPracticeClient';
import { Sentence } from '@/types/ai-practice';

export default async function AISpeakingPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const supabase = await createClient();
  
  const resolvedParams = await params;
  const topicSlug = resolvedParams.topicSlug;

  
  const { data: sentences, error } = await supabase
    .from('sentences')
    .select('*')
    .eq('topic_slug', topicSlug)
    .limit(20);

  if (error) {
    console.error("Lỗi fetch dữ liệu:", error);
    return <div>Đã xảy ra lỗi khi tải dữ liệu từ máy chủ.</div>;
  }

  if (!sentences || sentences.length === 0) {
    return <div>Chủ đề này chưa có dữ liệu.</div>;
  }

  return <SpeakingPracticeClient sentences={sentences} topicName={topicSlug} />;
}