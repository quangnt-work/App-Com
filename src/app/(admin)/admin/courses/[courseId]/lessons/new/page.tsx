'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/admin/courses/RichTextEditor'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateLessonPage({ params }: { params: { courseId: string } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') // Lưu HTML từ Editor
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setIsSubmitting(true)
    
    // 1. Tạo Module giả định (Trong thực tế bạn nên cho chọn module)
    // Để demo nhanh, ta tạo lesson vào module đầu tiên hoặc tạo mới
    const { data: moduleData } = await supabase.from('modules').select('id').eq('course_id', params.courseId).single()
    
    let moduleId = moduleData?.id
    if (!moduleId) {
        const { data: newModule } = await supabase.from('modules').insert({ course_id: params.courseId, title: 'Chương 1' }).select().single()
        moduleId = newModule.id
    }

    // 2. Lưu bài giảng
    const { error } = await supabase.from('lessons').insert({
      module_id: moduleId,
      title,
      content, 
      is_free: false
    })

    if (!error) {
      toast.success('Tạo bài giảng thành công!')
      router.push(`/admin/courses`)
    } else {
      toast.error('Lỗi khi lưu bài giảng')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Soạn bài giảng mới</h1>
        <Button onClick={handleSave} disabled={isSubmitting}>
           {isSubmitting ? 'Đang lưu...' : 'Lưu bài giảng'}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="font-bold">Tiêu đề bài học</label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Ví dụ: Giới thiệu về Next.js" 
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold">Nội dung chi tiết</label>
        {/* Nhúng bộ soạn thảo vào đây */}
        <RichTextEditor content={content} onChange={(html) => setContent(html)} />
      </div>
    </div>
  )
}