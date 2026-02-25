'use server'


import { LessonSchema, LessonInput } from "@/lib/schemas/lesson";
import { createClient } from "@/lib/supabase/server";
import { LessonService } from "@/services/lesson-service";
import { revalidatePath } from "next/cache";


export async function getLessons(page = 1, pageSize = 10, search = "", category = "") {
  const { data, count, error } = await LessonService.getList(page, pageSize, search, category);
  if (error) {
    console.error("Lỗi lấy bài học:", error);
    return { data: [], count: 0, error: error.message };
  }
  return { data, count, error };
}


export async function getLesson(id: string) {
  const { data, error } = await LessonService.getDetail(id);
  if (error) return { error: error.message };
  return { data };
}


export async function upsertLesson(formData: LessonInput, lessonId?: string) {
 
  // 1. Validate Input
  const validated = LessonSchema.safeParse(formData);
  if (!validated.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: validated.error.flatten()
    };
  }


  try {
    const payload = {
      ...validated.data,
      ...(lessonId ? { id: lessonId } : {})
    }
    // 2. Gọi Service xử lý logic
    const { error } = await LessonService.upsert(payload);
    if (error) throw error;


    // 3. Revalidate cache
    revalidatePath('/admin/lessons');
    if (lessonId) revalidatePath(`/admin/lessons/${lessonId}`);
    revalidatePath('/student/lessons');
   
    return { success: true, message: "Lưu bài học thành công!" };
  } catch (e: any) {
    console.error("Upsert Lesson Error:", e);
    // Trả về lỗi thân thiện hơn tùy loại lỗi
    const msg = e.message.includes("Forbidden") ? "Bạn không có quyền thực hiện" : (e.message || "Lỗi hệ thống");
    return { success: false, message: msg };
  }
}


export async function deleteLesson(id: string) {
  try {
    const { error } = await LessonService.delete(id);
    if (error) throw error;
   
    revalidatePath('/admin/lessons');
    return { success: true, message: "Đã xóa bài học" };
  } catch (e: any) {
    return { success: false, message: e.message || "Không thể xóa bài học này" };
  }
}
