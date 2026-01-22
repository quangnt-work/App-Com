'use server'

import { createClient } from "@/lib/supabase/server";
import { Course } from "@/types/database-custom";
import { revalidatePath } from "next/cache";

// Fetch list khóa học
export async function getCourses(): Promise<{ data: Course[] | null, error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*, lessons(count)') // Ví dụ join để đếm bài học
    .order('created_at', { ascending: false });

  // Map lại data nếu cần thiết để khớp với Type
  return { data: data as any, error };
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