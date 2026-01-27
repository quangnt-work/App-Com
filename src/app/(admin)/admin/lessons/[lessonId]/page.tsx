// src/app/(admin)/admin/lessons/[lessonId]/page.tsx
import { createClient } from '@/lib/supabase/server';
import LessonEditor from '@/components/admin/lessons/LessonEditor';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  // 1. Resolve params (Next.js 15+)
  const { lessonId } = await params;

  // 2. Xác định chế độ: Nếu lessonId là 'new' -> Tạo mới
  const isNew = lessonId === 'new';
  let initialData = null;

  // 3. Nếu là chế độ Sửa, fetch dữ liệu từ DB
  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error || !data) {
      // Nếu ID không tồn tại, redirect về trang danh sách
      return redirect('/admin/lessons');
    }
    initialData = data;
  }

  // 4. Render Editor (UI giữ nguyên)
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <LessonEditor
        lessonId={lessonId}
        initialData={initialData}
        isNew={isNew}
      />
    </div>
  );
}