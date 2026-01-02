// src/components/admin/courses/CourseEditor.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, ChevronLeft, Loader2, PlusCircle, LayoutTemplate } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Imports Component con
import GeneralInfo from '@/components/admin/lessons/GeneralInfo'
import LessonContent from '@/components/admin/lessons/LessonContent'
import AudioSection from '@/components/admin/lessons/AudioSection'
import QuizSection, { Question } from '@/components/admin/lessons/QuizSection'

interface CourseEditorProps {
  initialData?: any;
  isNew?: boolean;
}

export default function CourseEditor({ initialData, isNew = false }: CourseEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)

  // --- STATE ---
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [contentType, setContentType] = useState<'upload' | 'editor'>('upload')
  const [contentHtml, setContentHtml] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  // --- LOAD DATA ---
  useEffect(() => {
    if (isNew || !initialData?.id) return;

    const fetchLesson = async () => {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', initialData.id)
        .limit(1)

      if (lessons && lessons.length > 0) {
        const l = lessons[0]
        setLessonId(l.id)
        setQuestions(l.questions || [])
        setAudioUrl(l.audio_url || null)

        if (l.content && l.content.startsWith('http')) {
            setContentType('upload')
            setFileUrl(l.content)
        } else {
            setContentType('editor')
            setContentHtml(l.content || '')
        }
      }
    }
    fetchLesson()
  }, [initialData, isNew])

  // --- SAVE FUNCTION ---
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên khóa học');
      return;
    }

    setIsSaving(true)
    try {
      let currentCourseId = initialData?.id;

      // 1. Course Table
      if (isNew) {
        const { data: newCourse, error } = await supabase
          .from('courses')
          .insert([{ title, description }])
          .select().single()
        if (error) throw error;
        currentCourseId = newCourse.id;
      } else {
        const { error } = await supabase
          .from('courses')
          .update({ title, description })
          .eq('id', currentCourseId)
        if (error) throw error;
      }

      // 2. Lesson Table
      const finalContent = contentType === 'upload' ? fileUrl : contentHtml;
      const lessonPayload = {
        course_id: currentCourseId,
        title: title,
        description: description,
        content: finalContent,
        audio_url: audioUrl,
        questions: questions
      }

      if (lessonId && !isNew) {
        await supabase.from('lessons').update(lessonPayload).eq('id', lessonId)
      } else {
        await supabase.from('lessons').insert([lessonPayload])
      }

      toast.success(isNew ? 'Đã tạo mới thành công!' : 'Đã lưu thay đổi!')
      router.push('/admin/courses')
      router.refresh()

    } catch (error: any) {
      console.error(error)
      toast.error(`Lỗi: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    // THAY ĐỔI 1: Xóa max-w-5xl, dùng w-full và min-h-screen
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* HEADER: Full Width & Sticky */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-6 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 hover:text-sky-600">
                <ChevronLeft className="w-6 h-6" />
             </Button>
             <div>
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   {isNew ? 'Thêm khóa học mới' : 'Biên tập nội dung'}
                </h1>
                <p className="text-xs text-slate-500">
                   {isNew ? 'Bản nháp chưa lưu' : `Đang chỉnh sửa: ${title}`}
                </p>
             </div>
          </div>

          <div className="flex gap-3">
             <Button variant="outline" className="hidden sm:flex">Xem trước</Button>
             <Button disabled={isSaving} onClick={handleSave} className="bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20">
               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
               {isNew ? 'Lưu bài mới' : 'Lưu thay đổi'}
             </Button>
          </div>
        </div>
      </div>

      {/* BODY: Layout Grid 2 Cột */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
          
          {/* CỘT TRÁI (MAIN): Nội dung bài học (Chiếm 8 phần trên màn lớn) */}
          <div className="xl:col-span-8 space-y-6">
             <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <LessonContent 
                    contentType={contentType} setContentType={setContentType}
                    contentHtml={contentHtml} setContentHtml={setContentHtml}
                    fileUrl={fileUrl} setFileUrl={setFileUrl}
                />
             </div>
          </div>

          {/* CỘT PHẢI (SIDEBAR): Thông tin & Cấu hình (Chiếm 4 phần) */}
          <div className="xl:col-span-4 space-y-6">
             {/* Sticky Wrapper: Giúp cột phải trượt theo khi cuộn content dài */}
             <div className="sticky top-24 space-y-6">
                
                <GeneralInfo 
                    title={title} setTitle={setTitle} 
                    description={description} setDescription={setDescription} 
                />

                <AudioSection audioUrl={audioUrl} setAudioUrl={setAudioUrl} />

                <QuizSection questions={questions} setQuestions={setQuestions} />

             </div>
          </div>

        </div>
      </div>
    </div>
  )
}