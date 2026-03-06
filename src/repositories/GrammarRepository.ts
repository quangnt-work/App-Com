import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.type";

type LessonInsert = Database['public']['Tables']['grammars']['Insert'];
type LessonUpdate = Database['public']['Tables']['grammars']['Update'];

interface GetLessonsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  type?: string; // Lọc theo type: 'audio' | 'video' | 'text' | ...
}

export const GrammarRepository = {
  async findBySlug(slug: string) {
    const supabase = await createClient();
    return supabase.from('grammars').select('id').eq('slug', slug).single();
  },

  async getLessons({ page = 1, pageSize = 10, search, category, status, type }: GetLessonsParams) {
    const supabase = await createClient();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('grammars')
      .select('*', { count: 'exact' });

    if (search) query = query.ilike('title', `%${search}%`);
    if (category && category !== 'ALL') query = query.eq('category', category);
    if (status && status !== 'all') query = query.eq('status', status);
    if (type) query = query.eq('type', type); // filter theo type

    return await query
      .range(start, end)
      .order('created_at', { ascending: false });
  },

  async create(payload: LessonInsert) {
    const supabase = await createClient();
    return supabase.from('grammars').insert(payload);
  },

  async update(id: string, payload: LessonUpdate) {
    const supabase = await createClient();
    return supabase.from('grammars').update(payload).eq('id', id);
  },

  async delete(id: string) {
    const supabase = await createClient();
    return supabase.from('grammars').delete().eq('id', id);
  },

  async getById(id: string) {
    const supabase = await createClient();
    return supabase.from('grammars').select('*').eq('id', id).single();
  },

  // src/repositories/lesson-repository.ts
  async getByCategory(category: string, limit = 4) {
    const supabase = await createClient();
    return supabase
      .from('grammars')
      .select('*')
      .eq('category', category)
      .eq('status', 'published') // Chỉ lấy bài đã public
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  async getByType(type: string, page = 1, pageSize = 12) {
    const supabase = await createClient();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    return supabase
      .from('grammars')
      .select('*', { count: 'exact' })
      .eq('type', type)
      .eq('status', 'published')
      .order('created_at', { ascending: true }) // ASC: Bài cũ (Bài 1) hiển thị trước
      .range(start, end);
  },
};