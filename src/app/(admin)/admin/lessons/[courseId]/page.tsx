// src/app/(admin)/admin/courses/[courseId]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CourseEditor from '@/components/admin/courses/CourseEditor'

interface PageProps {
  params:Promise <{
    courseId: string
  }>
}

export default async function EditCoursePage({ params }: PageProps) {
  const supabase = await createClient()
  const resolvedParams = await params;

  // Fetch dữ liệu khóa học
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', resolvedParams.courseId)
    .single()

  if (!course) {
    redirect('/admin/courses')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Gọi Component với isNew = false (mặc định) và truyền dữ liệu */}
      <CourseEditor initialData={course} isNew={false} />
    </div>
  )
}