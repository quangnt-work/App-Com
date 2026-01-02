// src/components/admin/lessons/LessonEditor.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Import các thành phần con
import LessonHeader from './LessonHeader'
import GeneralInfo from './GeneralInfo'
import LessonContent from './LessonContent' // Component mới
import AudioSection from './AudioSection'
import QuizSection, { Question } from './QuizSection'

interface LessonEditorProps {
  courseId: string;
  initialData?: any;
  isNew: boolean;
}

export default function LessonEditor({ courseId, initialData, isNew }: LessonEditorProps) {
  const router = useRouter()

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  
  // State cho nội dung (File upload hoặc HTML content)
  const [contentType, setContentType] = useState<'upload' | 'editor'>('upload')
  const [contentHtml, setContentHtml] = useState(initialData?.content || '')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null) // Demo file state

  // State Audio
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // State Câu hỏi
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || [])

  // --- HÀM XỬ LÝ LƯU ---
  const handleSave = async () => {
    // Logic gọi API lưu dữ liệu (Supabase)
    console.log({ title, description, questions })
    toast.success('Đã lưu bài giảng thành công!')
    // router.push(`/admin/courses/${courseId}`)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-sans text-slate-900">
      
      {/* 1. HEADER */}
      <LessonHeader 
        courseId={courseId} 
        title={title} 
        onSave={handleSave} 
      />

      {/* 2. THÔNG TIN CHUNG */}
      <GeneralInfo 
        title={title} 
        setTitle={setTitle} 
        description={description} 
        setDescription={setDescription} 
      />

      {/* 3. NỘI DUNG BÀI HỌC (Tabs: Upload / Editor) */}
      <LessonContent 
        contentType={contentType}
        setContentType={setContentType}
        contentHtml={contentHtml}
        setContentHtml={setContentHtml}
      />

      {/* 4. TÀI LIỆU NGHE (AUDIO) */}
      <AudioSection />

      {/* 5. BÀI TẬP TRẮC NGHIỆM */}
      <QuizSection 
        questions={questions} 
        setQuestions={setQuestions} 
      />

      {/* 6. FOOTER ACTIONS */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
        <Button variant="ghost" className="text-slate-500 hover:text-slate-900" onClick={() => router.back()}>
          Hủy bỏ
        </Button>
        <Button onClick={handleSave} className="bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold">
          Lưu bản nháp
        </Button>
      </div>

    </div>
  )
}