// app/(admin)/lessons/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Hàm khởi tạo Supabase Server Client
import GrammarForm from '@/components/admin/lessons/grammars/grammar-editor/GrammarForm';
import { GrammarType, Grammar } from '@/types/grammar';
import { GrammarInput } from '@/lib/schemas/grammar';

interface EditGrammarPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditGrammarPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: grammar } = await supabase
    .from('grammars')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: grammar ? `Chỉnh sửa: ${grammar.title}` : 'Không tìm thấy bài học',
  };
}

export default async function EditGrammarPage(props: EditGrammarPageProps) {
  const params = await props.params;
  const grammarId = params.id;
  const supabase = await createClient();

  // 1. Fetch dữ liệu bài học từ Supabase
  const { data: grammar, error } = await supabase
    .from('grammars')
    .select('*')
    .eq('id', grammarId)
    .single();

  // 2. Xử lý trường hợp không tìm thấy hoặc lỗi
  if (error || !grammar) {
    if (error) console.error("Error fetching grammar:", error);
    notFound();
  }

  const formattedData: GrammarInput = {
    id: grammar.id,
    title: grammar.title,
    description: grammar.description || '',
    type: "file",   // Grammar module chỉ dùng type='file'
    file_url: grammar.file_url || '',
    content: grammar.content || '',
    audio_url: grammar.audio_url || null,
    questions: [],
    category: grammar.category || '',
    status: grammar.status === 'published'
  };

  return (
    <main>
      <GrammarForm
        initialData={formattedData}
        isEditing={true}
      />
    </main>
  );
}