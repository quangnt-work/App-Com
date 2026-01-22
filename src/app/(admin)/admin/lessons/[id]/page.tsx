import { createClient } from '@/lib/supabase/server';
import LessonEditor from '@/components/admin/lessons/LessonEditor'; // Import từ folder components vừa tạo
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const isNew = resolvedParams.lessonId === 'new';
  let initialData = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', resolvedParams.lessonId)
      .single();

    if (error || !data) {
       // redirect về danh sách nếu lỗi
       return redirect(`/admin/lessons/${resolvedParams.courseId}`);
    }
    initialData = data;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <LessonEditor
        lessonId={resolvedParams.lessonId}
        initialData={initialData}
        isNew={isNew}
      />
    </div>
  );
}