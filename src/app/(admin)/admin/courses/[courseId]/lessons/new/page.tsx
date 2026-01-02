// Đường dẫn: src/app/(admin)/admin/courses/[courseId]/lessons/new/page.tsx
import LessonEditor from '@/components/admin/lessons/LessonEditor';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function CreateLessonPage({ params }: PageProps) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <LessonEditor 
        courseId={courseId} 
        initialData={null} 
        isNew={true} 
      />
    </div>
  );
}