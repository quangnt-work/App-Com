import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExamEditor from '@/components/admin/exams/ExamEditor'

// 1. Cập nhật Type cho params là Promise
export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  // 2. Await params trước khi sử dụng
  const { id } = await params
  
  const supabase = await createClient()
  
  // 3. Sử dụng biến 'id' đã lấy được
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()
  
  if (examError || !exam) {
    return notFound()
  }
  
  const { data: questions } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('exam_id', id)
    .order('order_index', { ascending: true })

  return (
    <ExamEditor 
      isNew={false} 
      initialExam={exam} 
      initialQuestions={questions || []} 
    />
  )
}