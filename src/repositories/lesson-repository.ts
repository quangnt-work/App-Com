import { createClient } from "@/lib/supabase/server";
import { LessonInput } from "@/lib/schemas/lesson";

export const LessonRepository = {
  async findBySlug(slug: string) {
    const supabase = await createClient();
    return supabase.from('lessons').select('id').eq('slug', slug).single();
  },

  async getLessons(page = 1, pageSize = 10, search = "", category = "") {
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

    return query;
  },

  async create(payload: any) {
    const supabase = await createClient();
    return supabase.from('lessons').insert(payload);
  },

  async update(id: string, payload: any) {
    const supabase = await createClient();
    return supabase.from('lessons').update(payload).eq('id', id);
  },

  async delete(id: string) {
    const supabase = await createClient();
    return supabase.from('lessons').delete().eq('id', id);
  }
};