'use server'

import { createClient } from "@/lib/supabase/server";
import { CourseSchema, CourseInput } from "@/lib/schemas/course";
import { Course } from "@/types/database-custom";
import { revalidatePath } from "next/cache";

// Fetch list khóa học
export async function getCourses(page = 1, pageSize = 10, search = "") {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('courses')
    .select('*, lessons(count)', { count: 'exact' })
    .range(start, end)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, count, error } = await query;
  return { data, count, error };
}

export async function upsertCourse(data: CourseInput) {
  // 1. Validate dữ liệu tại Server
  const result = CourseSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const payload = {
    ...result.data,
    updated_at: new Date().toISOString(),
  };

  // 2. Gọi DB
  const { data: course, error } = await supabase
    .from('courses')
    .upsert(payload)
    .select()
    .single();

  if (error) return { error: error.message };

  // 3. Clear cache
  revalidatePath('/admin/courses');
  return { success: true, data: course };
}

// Xóa khóa học
export async function deleteCourse(courseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  
  if (!error) {
    revalidatePath('/admin/courses'); // Tự động làm mới cache trang admin
  }
  return { error };
}