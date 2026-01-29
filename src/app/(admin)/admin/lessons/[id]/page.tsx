// app/(admin)/lessons/[id]/page.tsx
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Hàm khởi tạo Supabase Server Client
import LessonForm from '@/components/admin/lessons/lesson-editor/lesson-form';
import { LessonFormData } from '@/types/lesson';

interface EditLessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditLessonPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: lesson ? `Chỉnh sửa: ${lesson.title}` : 'Không tìm thấy bài học',
  };
}

export default async function EditLessonPage(props : EditLessonPageProps) {
  const params = await props.params;
  const lessonId = params.id;
  const supabase = await createClient();

  // 1. Fetch dữ liệu bài học từ Supabase
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  // 2. Xử lý trường hợp không tìm thấy hoặc lỗi
  if (error || !lesson) {
    if (error) console.error("Error fetching lesson:", error);
    notFound(); 
  }

  const formattedData: LessonFormData = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type as 'file' | 'text', 
      file_url: lesson.file_url,
      content: lesson.content || '',
      audio_url: lesson.audio_url,
      questions: Array.isArray(lesson.questions) ? lesson.questions : [],
      category: lesson.category || '',
      status: lesson.status ?? false
  };

  return (
    <main>
      <LessonForm 
        initialData={formattedData} 
        isEditing={true} 
      />
    </main>
  );
}