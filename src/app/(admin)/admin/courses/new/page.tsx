// src/app/(admin)/admin/courses/new/page.tsx
import CourseEditor from '@/components/admin/courses/CourseEditor'

export default function NewCoursePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Gọi Component với cờ isNew = true */}
      <CourseEditor isNew={true} />
    </div>
  )
}