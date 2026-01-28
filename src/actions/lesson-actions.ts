'use server'

import { LessonSchema, LessonInput } from "@/lib/schemas/lesson";
import { LessonService } from "@/services/lesson-service";
import { revalidatePath } from "next/cache";

export async function getLessons(page = 1, pageSize = 10, search = "", category = "") {
  const { data, count, error } = await LessonService.getList(page, search, category);
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

export async function upsertLesson(formData: LessonInput) {
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
    // 2. Gọi Service xử lý logic
    const { error } = await LessonService.upsert(validated.data);
    if (error) throw error;

    // 3. Revalidate cache
    revalidatePath('/admin/lessons');
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