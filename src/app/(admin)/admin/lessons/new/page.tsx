// src/app/(admin)/admin/lessons/new/page.tsx
import LessonEditor from '@/components/admin/lessons/LessonEditor'

export default function NewLessonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Gọi Component với cờ isNew = true */}
      <LessonEditor isNew={true} />
    </div>
  )
}