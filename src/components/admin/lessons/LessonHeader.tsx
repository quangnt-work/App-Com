// src/components/admin/lessons/LessonHeader.tsx
import Link from 'next/link'
import { ChevronRight, Eye, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  courseId: string;
  title: string;
  onSave: () => void;
}

export default function LessonHeader({ courseId, title, onSave }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
          <Link href="/admin/dashboard" className="hover:text-sky-600">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/admin/courses" className="hover:text-sky-600">Quản lý khóa học</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Chỉnh sửa bài học</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          {title || 'Bài học mới'}
        </h1>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          ☁️ Đã lưu 2 phút trước
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">
          Xem trước
        </Button>
        <Button onClick={onSave} className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20">
          <Save className="w-4 h-4 mr-2" /> Xuất bản
        </Button>
      </div>
    </div>
  )
}