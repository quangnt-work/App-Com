import { createClient } from '@/lib/supabase/server';
import LessonEditor from '@/components/admin/lessons/LessonEditor'; // Import từ folder components vừa tạo
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: PageProps) {
  const isNew = params.lessonId === 'new';
  let initialData = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', params.lessonId)
      .single();

    if (error || !data) {
       // redirect về danh sách nếu lỗi
       return redirect(`/admin/courses/${params.courseId}`);
    }
    initialData = data;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <LessonEditor
        courseId={params.courseId}
        initialData={initialData}
        isNew={isNew}
      />
    </div>
  );
}