'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Định nghĩa Schema Validation (Nên tách ra file riêng nếu tái sử dụng)
const QuestionSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  type: z.enum(['multiple_choice', 'essay', 'fill_in_blank', 'reorder', 'group', 'reading', 'error_id']), // Bổ sung các type từ ExamPreviewModal
  points: z.number().default(1),
  options: z.array(z.string()).optional(),
  correctOptionIndex: z.number().optional(),
  // Thêm các trường khác tùy nhu cầu thực tế
}).passthrough(); // Cho phép các trường khác đi qua (như media_url)

const ExamSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Tên đề thi phải có ít nhất 5 ký tự"),
  description: z.string().optional(),
  duration_minutes: z.coerce.number().min(0),
  is_published: z.boolean().default(false),
  questions: z.array(QuestionSchema).default([]),
});

type ExamInput = z.infer<typeof ExamSchema>;

// Helper check quyền Admin
async function checkAdminRole(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return profile?.role === 'admin';
}

// Lấy danh sách đề thi
export async function getExams() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Lỗi getExams:", error);
    return { success: false, error: error.message };
  }
}

// Lấy chi tiết 1 đề thi
export async function getExamById(id: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Tạo hoặc cập nhật đề thi
export async function upsertExam(examData: ExamInput) {
  const supabase = await createClient();

  // 1. Bảo mật: Check quyền Admin
  const isAdmin = await checkAdminRole(supabase);
  if (!isAdmin) {
    return { success: false, message: "Bạn không có quyền thực hiện thao tác này." };
  }

  // 2. Validate dữ liệu đầu vào
  const validated = ExamSchema.safeParse(examData);
  if (!validated.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validated.error.flatten()
    };
  }

  const baseData = {
    title: validated.data.title,
    description: validated.data.description,
    duration: validated.data.duration_minutes, // Map sang cột 'duration' của DB
    is_published: validated.data.is_published,
    questions: validated.data.questions,
    updated_at: new Date().toISOString(),
    // Các giá trị mặc định để thỏa mãn DB constraints
    subject: 'General', 
    level: 'Beginner',
  };

  try {
    let error;

    // UPDATE
    if (examData.id && examData.id !== 'new') {
      const result = await supabase
        .from('exams')
        .update(baseData) // Update không cần gửi lại code
        .eq('id', examData.id);
      error = result.error;
    } 
    // INSERT
    else {
      const result = await supabase
        .from('exams')
        .insert({
          ...baseData,
          code: `EX-${Date.now()}`, // Chỉ sinh code khi tạo mới
        });
      error = result.error;
    }

    if (error) throw error;

    revalidatePath('/admin/exams');
    if (examData.id) revalidatePath(`/admin/exams/${examData.id}`);

    return { success: true, message: "Lưu đề thi thành công!" };

  } catch (e: any) {
    console.error("Upsert Exam Error:", e);
    return { success: false, message: e.message || "Lỗi hệ thống." };
  }
}

// Xóa đề thi
export async function deleteExam(id: string) {
  const supabase = await createClient();

  // 1. Check quyền
  const isAdmin = await checkAdminRole(supabase);
  if (!isAdmin) {
    return { success: false, message: "Forbidden" };
  }

  try {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/exams');
    return { success: true, message: "Đã xóa đề thi" };
  } catch (e: any) {
    return { success: false, message: e.message || "Không thể xóa đề thi này" };
  }
}