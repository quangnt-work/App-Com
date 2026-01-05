// src/components/admin/exams/ExamEditor.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, Eye, Loader2 } from 'lucide-react'

// Types & Hooks
import { ExamData, Question } from '@/types/exam-editor'
import { useExamForm } from '@/hooks/useExamForm' // (Hoặc import logic trong file nếu bạn không tách file)

// Components
import { ExamInfoSidebar } from './ExamInfoSidebar'
import { StatsCards } from './stats-cards'
import { QuestionList } from './QuestionList'
import { ExamPreviewModal } from './ExamPreviewModal'

interface Props {
  initialExam?: ExamData;
  initialQuestions?: Question[]; // Dữ liệu phẳng từ DB
  isNew: boolean;
}

export default function ExamEditor({ initialExam, initialQuestions, isNew }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // Sử dụng Custom Hook quản lý dữ liệu
  const { 
    exam, setExam, 
    questions, 
    addOrUpdateQuestion, 
    deleteQuestion 
  } = useExamForm(initialExam, initialQuestions);

  // UI States
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // --- Wrapper Handlers cho UI ---
  const handleSaveQuestionUI = (qData: Question) => {
    // Đảm bảo ID luôn tồn tại
    const questionWithId = qData.id ? qData : { ...qData, id: crypto.randomUUID() };
    addOrUpdateQuestion(questionWithId, editingIndex);
    setEditingIndex(null);
  }

  const handleDeleteQuestionUI = (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nội dung này? (Các câu hỏi con bên trong cũng sẽ bị xóa)')) {
      deleteQuestion(index);
    }
  }

  // --- CORE SAVE LOGIC ---
  const handleSaveExam = async () => {
    if (!exam.title.trim()) return toast.error('Vui lòng nhập tên đề thi')
    
    setIsSaving(true)
    try {
      let currentExamId = exam.id

      // 1. Prepare Payload
      const examPayload = {
        title: exam.title,
        subject: exam.subject,
        level: exam.level,
        duration: exam.duration,
        status: exam.status,
        description: exam.description,
        total_score: exam.total_score,
        code: exam.code || `EXAM-${Date.now().toString().slice(-6)}`,
        // Đếm tổng số câu hỏi (bao gồm câu con trong group)
        question_count: questions.reduce((acc, q) => acc + (q.type === 'group' ? (q.sub_questions?.length || 0) : 1), 0)
      }

      // 2. Insert/Update Exam
      if (isNew) {
        const { data, error } = await supabase.from('exams').insert([examPayload]).select().single()
        if (error) throw error
        currentExamId = data.id
      } else {
        if (!currentExamId) throw new Error("Missing Exam ID for update");
        const { error } = await supabase.from('exams').update(examPayload).eq('id', currentExamId)
        if (error) throw error
      }

      // 3. Handle Questions (Strategy: Delete All -> Insert All)
      if (!isNew && currentExamId) {
        await supabase.from('exam_questions').delete().eq('exam_id', currentExamId)
      }

      // Helper: Map Question object to DB Payload
      const createQuestionPayload = (q: Question, examId: string, parentId: string | null, index: number) => ({
        exam_id: examId,
        parent_id: parentId,
        content: q.content,
        type: q.type,
        difficulty: q.difficulty || 'medium',
        score: q.score || 0,
        options: q.options || [],
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        media_url: q.media_url,
        order_index: index,
      });

      // Loop & Insert
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // A. Insert Parent
        const parentPayload = createQuestionPayload(q, currentExamId!, null, i);
        
        const { data: parentData, error: pError } = await supabase
          .from('exam_questions')
          .insert(parentPayload)
          .select()
          .single();
        
        if (pError) throw pError;

        // B. Insert Children (if Group)
        if (q.type === 'group' && q.sub_questions && q.sub_questions.length > 0) {
          const childrenPayloads = q.sub_questions.map((sub, sIdx) => 
            createQuestionPayload(sub, currentExamId!, parentData.id, sIdx)
          );

          const { error: cError } = await supabase.from('exam_questions').insert(childrenPayloads);
          if (cError) throw cError;
        }
      }

      toast.success(isNew ? 'Đã tạo đề thi thành công!' : 'Đã lưu thay đổi!')
      router.push('/admin/exams')
      router.refresh()

    } catch (error: any) {
      console.error('Save failed:', error)
      toast.error(`Lỗi hệ thống: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
            <span className="cursor-pointer hover:text-sky-600 transition-colors" onClick={() => router.push('/admin/dashboard')}>Trang chủ</span>
            <span className="text-slate-300">/</span>
            <span className="cursor-pointer hover:text-sky-600 transition-colors" onClick={() => router.push('/admin/exams')}>Quản lý đề thi</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{isNew ? 'Thêm mới' : 'Biên tập'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            {isNew ? 'Soạn Thảo Đề Thi Mới' : `Biên tập: ${exam.title}`}
          </h1>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="hidden md:flex bg-white" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" /> Xem trước
          </Button>
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-red-500 hover:bg-red-50">
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleSaveExam} 
            disabled={isSaving}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/20 min-w-[140px]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isNew ? 'Lưu đề thi' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* 2. BODY LAYOUT */}
      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        {/* CỘT TRÁI (3/12): Thông tin chung */}
        <div className="xl:col-span-3">
          <ExamInfoSidebar 
            exam={exam} 
            setExam={setExam} 
          />
        </div>

        {/* CỘT PHẢI (9/12): Danh sách câu hỏi */}
        <div className="xl:col-span-9 space-y-6">
          <StatsCards questions={questions} />
          
          <QuestionList 
            questions={questions}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            onSave={handleSaveQuestionUI}
            onDelete={handleDeleteQuestionUI}
          />
        </div>
      </div>

      {/* 3. MODAL PREVIEW */}
      <ExamPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        exam={exam}
        questions={questions}
      />
    </div>
  )
}