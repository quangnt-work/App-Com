'use server'

import { createClient } from "@/lib/supabase/server";
import { LessonInput } from "@/types/lesson";
import { revalidatePath } from "next/cache";

// Lấy danh sách bài giảng (có phân trang & lọc)
export async function getLessons(page = 1, pageSize = 10, search = "", category = "") {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('lessons')
    .select('*', { count: 'exact' })
    .range(start, end)
    .order('created_at', { ascending: false });

  if (search) query = query.ilike('title', `%${search}%`);
  if (category && category !== 'ALL') query = query.eq('category', category);

  const { data, count, error } = await query;
  return { data, count, error };
}

// Lấy chi tiết 1 bài
export async function getLessonById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
  return { data, error };
}

// Thêm hoặc Sửa
export async function upsertLesson(data: LessonInput) {
  const supabase = await createClient();
  
  // Map dữ liệu từ Form sang chuẩn DB
  const payload = {
    title: data.title,
    slug: data.slug || undefined, // Nên có hàm tạo slug tự động
    description: data.description,
    thumbnail: data.thumbnail,
    type: data.type,
    content: data.type === 'text' ? data.content : null,
    file_url: data.type !== 'text' ? data.file_url : null,
    category: data.category,
    status: data.status ? 'published' : 'draft', // Convert boolean sang text
    updated_at: new Date().toISOString(),
  };

  let query;
  if (data.id && data.id !== 'new') {
    query = supabase.from('lessons').update(payload).eq('id', data.id);
  } else {
    query = supabase.from('lessons').insert(payload);
  }

  const { error } = await query;
  
  revalidatePath('/admin/lessons');
  return { error };
}

export async function deleteLesson(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  revalidatePath('/admin/lessons');
  return { error };
}