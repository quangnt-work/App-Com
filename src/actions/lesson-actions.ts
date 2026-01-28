//src/actions

'use server'

import { createClient } from "@/lib/supabase/server";
import { LessonSchema, LessonInput } from "@/lib/schemas/lesson";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

async function generateUniqueSlug(title: string, currentId?: string) {
  const supabase = await createClient();
  let slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
  
  // Kiểm tra xem slug đã tồn tại chưa (trừ bài đang sửa)
  let query = supabase.from('lessons').select('id').eq('slug', slug);
  if (currentId && currentId !== 'new') {
    query = query.neq('id', currentId);
  }
  
  const { data } = await query;
  
  // Nếu trùng, thêm timestamp vào đuôi
  if (data && data.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  return slug;
}

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

  if (search.trim()) query = query.ilike('title', `%${search.trim()}%`);

  if (category && category !== 'ALL') query = query.eq('category', category);

  const { data, count, error } = await query;

  if (error) {
    console.error("Lỗi:", error);
    return { data: [], count: 0, error: error.message };
  }

  return { data, count, error };
}

// Lấy chi tiết 1 bài
export async function getLessonById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
  return { data, error };
}

// Thêm hoặc Sửa
export async function upsertLesson(formData: LessonInput) {
  const supabase = await createClient();

  const validated = LessonSchema.safeParse(formData);

  if (!validated.success) {
    return { success: false, message: "Dữ liệu không hợp lệ", errors: validated.error.flatten() };
  }

  const data = validated.data;

  try {
    let finalSlug = data.slug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = await generateUniqueSlug(data.title, data.id);
    }

    const payload = {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      thumbnail: data.thumbnail,
      type: data.type,
      content: data.type === 'text' ? data.content : null,
      file_url: data.type !== 'text' ? data.file_url : null,
      category: data.category,
      status: data.status ? 'published' : 'draft', // Convert boolean sang text
      updated_at: new Date().toISOString(),
    };

    let error;

    if (data.id && data.id !== 'new') {
      const res = await supabase.from('lessons').update(payload).eq('id', data.id);
      error = res.error;
    } else {
      const res = await supabase.from('lessons').insert(payload);
      error = res.error;
    }

    if (error) throw error;
  
    revalidatePath('/admin/lessons');
    revalidatePath('/student/lessons');

    return { success: true, message: "Lưu bài học thành công!" };
  } catch (e: any) {
    console.error("Upsert Lesson Error:", e);
    return { success: false, message: e.message || "Lỗi hệ thống" };
  }
}

export async function deleteLesson(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/lessons');
    return { success: true, message: "Đã xóa bài học" };
  } catch (e: any) {
    return { success: false, message: "Không thể xóa bài học này" };
  }
}