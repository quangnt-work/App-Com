'use server'

import { createClient } from "@/lib/supabase/server";
import { QuestionItem } from "@/types/exam-custom";
import { revalidatePath } from "next/cache";

// Lấy danh sách đề thi
export async function getExams() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Lấy chi tiết 1 đề thi
export async function getExamById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
}

// Tạo hoặc cập nhật đề thi
export async function upsertExam(examData: {
  id?: string;
  title: string;
  description?: string;
  duration_minutes: number;
  is_published: boolean;
  questions: QuestionItem[]; // Truyền mảng object chuẩn
}) {
  const supabase = await createClient();
  
  const payload = {
    title: examData.title,
    description: examData.description,
    duration_minutes: examData.duration_minutes,
    is_published: examData.is_published,
    questions: examData.questions as any, // Cast sang jsonb
    updated_at: new Date().toISOString(),
  };

  let result;
  if (examData.id && examData.id !== 'new') {
    // Update
    result = supabase.from('exams').update(payload).eq('id', examData.id);
  } else {
    // Insert
    result = supabase.from('exams').insert(payload);
  }

  revalidatePath('/admin/exams');
  return { error: result.error };
}

// Xóa đề thi
export async function deleteExam(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('exams').delete().eq('id', id);
  revalidatePath('/admin/exams');
  return { error };
}