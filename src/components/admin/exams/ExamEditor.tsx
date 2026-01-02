'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, Eye, Loader2, ChevronLeft } from 'lucide-react'

// --- IMPORTS COMPONENTS CON ---
import { ExamInfoSidebar } from './ExamInfoSidebar'
import { StatsCards } from './stats-cards'
import { QuestionList } from './QuestionList'
import { ExamPreviewModal } from './ExamPreviewModal'

interface Props {
  initialExam?: any;
  initialQuestions?: any[];
  isNew: boolean;
}

// --- HELPER: CHUYỂN FLAT DATA -> NESTED DATA (CHO UI) ---
// Supabase trả về list phẳng, ta cần gom nhóm các câu con vào câu cha (Bài đọc/Nghe)
const buildQuestionTree = (flatQuestions: any[]) => {
  if (!flatQuestions || !Array.isArray(flatQuestions) || flatQuestions.length === 0) {
    return [];
  }

  try {
      const roots: any[] = [];
      const map: Record<string, any> = {};

      // 1. Map init
      flatQuestions.forEach(q => {
        if(q && q.id) { // Chỉ xử lý khi có ID
            map[q.id] = { ...q, sub_questions: [] };
        }
      });

      // 2. Gom nhóm
      flatQuestions.forEach(q => {
        if (q && q.id) {
            if (q.parent_id && map[q.parent_id]) {
                map[q.parent_id].sub_questions.push(map[q.id]);
            } else if (!q.parent_id) {
                roots.push(map[q.id]);
            }
        }
      });

      // 3. Sort
      roots.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      roots.forEach(root => {
        if (root.sub_questions?.length > 0) {
          root.sub_questions.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        }
      });

      return roots;
  } catch (error) {
      console.error("Lỗi buildQuestionTree:", error);
      return []; // Nếu lỗi logic thì trả về mảng rỗng thay vì crash trang
  }
};

// --- MAIN COMPONENT ---
export default function ExamEditor({ initialExam, initialQuestions, isNew }: Props) {
  const router = useRouter()
  const supabase = createClient()
  
  // --- STATE ---
  const [exam, setExam] = useState(initialExam || {
    title: '', 
    subject: 'Toán học', 
    level: 'medium', 
    duration: 60, 
    status: 'draft', 
    description: '',
    total_score: 100,
    code: ''
  })

  // State câu hỏi (Dạng Nested Tree để hiển thị UI)
  const [questions, setQuestions] = useState<any[]>([])

  // UI States
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Init Data (Chạy 1 lần khi load trang để build tree)
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      const tree = buildQuestionTree(initialQuestions);
      setQuestions(tree);
    }
  }, [initialQuestions]);

  // --- HANDLERS (UI) ---

  const handleSaveQuestion = (qData: any) => {
    // Logic xử lý ID tạm cho UI
    const questionWithId = qData.id ? qData : { ...qData, id: crypto.randomUUID() };

    if (editingIndex === -1) {
      // Thêm mới vào cuối
      setQuestions([...questions, questionWithId])
    } else if (editingIndex !== null) {
      // Cập nhật tại vị trí index
      const newQuestions = [...questions]
      newQuestions[editingIndex] = questionWithId
      setQuestions(newQuestions)
    }
    setEditingIndex(null)
  }

  const handleDeleteQuestion = (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nội dung này? (Các câu hỏi con bên trong cũng sẽ bị xóa)')) {
      const newQuestions = questions.filter((_, i) => i !== index)
      setQuestions(newQuestions)
    }
  }

  // --- SAVE TO DB (CORE LOGIC) ---
  const handleSaveExam = async () => {
    if (!exam.title.trim()) return toast.error('Vui lòng nhập tên đề thi')
    
    setIsSaving(true)
    try {
      let currentExamId = exam.id

      // 1. UPSERT EXAM INFO
      const examPayload = {
        title: exam.title,
        subject: exam.subject,
        level: exam.level,
        duration: exam.duration,
        status: exam.status,
        description: exam.description,
        total_score: exam.total_score,
        code: exam.code || `EXAM-${Date.now().toString().slice(-6)}`,
        question_count: questions.reduce((acc, q) => acc + (q.type === 'group' ? (q.sub_questions?.length || 0) : 1), 0)
      }

      if (isNew) {
        const { data, error } = await supabase.from('exams').insert([examPayload]).select().single()
        if (error) throw error
        currentExamId = data.id
      } else {
        const { error } = await supabase.from('exams').update(examPayload).eq('id', currentExamId)
        if (error) throw error
      }

      // 2. HANDLE QUESTIONS (Delete All -> Re-insert Strategy)
      // Đây là cách an toàn nhất để xử lý thay đổi thứ tự và xóa sửa phức tạp
      if (!isNew) {
        await supabase.from('exam_questions').delete().eq('exam_id', currentExamId)
      }

      // 2a. Insert từng câu (Do cần lấy ID của Parent để gán cho Child, nên dùng vòng lặp for...of)
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // Prepare Payload cho câu cha (hoặc câu đơn)
        const parentPayload = {
            exam_id: currentExamId,
            content: q.content,
            type: q.type,
            difficulty: q.difficulty || 'medium',
            score: q.score || 0,
            options: q.options || [],
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            media_url: q.media_url,
            order_index: i,
            parent_id: null
        }

        // Insert Parent
        const { data: parentData, error: pError } = await supabase
            .from('exam_questions')
            .insert(parentPayload)
            .select()
            .single()
        
        if (pError) throw pError

        // 2b. Nếu là Group -> Insert Children
        if (q.type === 'group' && q.sub_questions?.length > 0) {
             const childrenPayload = q.sub_questions.map((sub: any, sIdx: number) => ({
                exam_id: currentExamId,
                parent_id: parentData.id, // LINK VỚI ID VỪA TẠO
                content: sub.content,
                type: sub.type,
                difficulty: sub.difficulty || 'medium', // Default fallback
                score: sub.score || 1,
                options: sub.options || [],
                correct_answer: sub.correct_answer,
                order_index: sIdx
             }))

             const { error: cError } = await supabase.from('exam_questions').insert(childrenPayload)
             if (cError) throw cError
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
            
            {/* Stats Cards (Tính toán số liệu realtime) */}
            <StatsCards questions={questions} />

            {/* Question List (Component chính quản lý thêm/sửa/xóa) */}
            <QuestionList 
                questions={questions}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                onSave={handleSaveQuestion}
                onDelete={handleDeleteQuestion}
            />
        </div>

      </div>

      {/* 3. MODAL PREVIEW */}
      <ExamPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        exam={exam} 
        questions={questions} // Truyền tree đã build để Modal hiển thị đúng group
      />
    </div>
  )
}