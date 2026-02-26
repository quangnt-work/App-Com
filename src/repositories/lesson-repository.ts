import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.type";

type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
type LessonUpdate = Database['public']['Tables']['lessons']['Update'];

interface GetLessonsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string; // Thêm lọc theo status (published/draft)
}

export const LessonRepository = {
  async findBySlug(slug: string) {
    const supabase = await createClient();
    return supabase.from('lessons').select('id').eq('slug', slug).single();
  },

  async getLessons({ page = 1, pageSize = 10, search, category, status }: GetLessonsParams) {
    const supabase = await createClient();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('lessons')
      .select('*', { count: 'exact' });

    if (search) query = query.ilike('title', `%${search}%`);
    if (category && category !== 'ALL') query = query.eq('category', category);
    if (status && status !== 'all') query = query.eq('status', status);

    return await query
      .range(start, end)
      .order('created_at', { ascending: false });
  },

  async create(payload: LessonInsert) {
    const supabase = await createClient();
    return supabase.from('lessons').insert(payload);
  },

  async update(id: string, payload: LessonUpdate) {
    const supabase = await createClient();
    return supabase.from('lessons').update(payload).eq('id', id);
  },

  async delete(id: string) {
    const supabase = await createClient();
    return supabase.from('lessons').delete().eq('id', id);
  },

  async getById(id: string) {
  const supabase = await createClient();
  return supabase.from('lessons').select('*').eq('id', id).single();
  },

  // src/repositories/lesson-repository.ts
async getByCategory(category: string, limit = 4) {
  const supabase = await createClient();
  return supabase
    .from('lessons')
    .select('*')
    .eq('category', category)
    .eq('status', 'published') // Chỉ lấy bài đã public
    .order('created_at', { ascending: false })
    .limit(limit);
  },
};