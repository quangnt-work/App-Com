import { LessonRepository } from "@/repositories/lesson-repository";
import { LessonInput } from "@/lib/schemas/lesson";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";
import { LESSON_STATUS } from "@/lib/constants/lesson-constants";

// Helper function tách riêng
async function generateUniqueSlug(title: string, currentId?: string) {
  let slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
  
  // Logic kiểm tra trùng lặp
  // ... (giữ nguyên logic cũ hoặc cải tiến check DB)
  // Tạm thời giữ nguyên logic check cơ bản
  const { data } = await LessonRepository.findBySlug(slug);
  if (data && data.id !== currentId) {
     slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  return slug;
}

// Hàm check quyền admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  // Nên check thêm role từ bảng profiles
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error("Forbidden: Admin access required");
}

export const LessonService = {
  async getList(page: number, pageSize: number, search: string, category: string) {
    return await LessonRepository.getLessons({page, pageSize, search, category});
  },

  async upsert(data: LessonInput) {
    // 1. Security Check
    await requireAdmin();

    // 2. Logic xử lý Slug
    let finalSlug = data.slug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = await generateUniqueSlug(data.title, data.id);
    }

    // 3. Chuẩn bị payload
    const payload = {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      thumbnail: data.thumbnail,
      type: data.type,
      content: data.type === 'text' ? data.content : null,
      file_url: data.type !== 'text' ? data.file_url : null,
      category: data.category,
      // Dùng Constant thay vì hardcode string
      status: data.status ? LESSON_STATUS.PUBLISHED : LESSON_STATUS.DRAFT,
      updated_at: new Date().toISOString(),
    };

    // 4. Gọi Repository
    if (data.id && data.id !== 'new') {
      return await LessonRepository.update(data.id, payload);
    } else {
      return await LessonRepository.create(payload);
    }
  },
  
  async delete(id: string) {
    await requireAdmin();
    return await LessonRepository.delete(id);
  },

  async getDetail(id: string) {
  return await LessonRepository.getById(id);
  },
};
