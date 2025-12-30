// src/services/courseService.ts (ví dụ)
import { createClient } from '@/lib/supabase/server';

export async function getCourses(page: number = 1, pageSize: number = 10) {
  const supabase = createClient();
  
  // Tính toán vị trí bắt đầu và kết thúc
  // Ví dụ: Trang 1 (0-9), Trang 2 (10-19)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await (await supabase)
    .from('courses')
    .select('*', { count: 'exact' }) // Lấy tổng số record để tính số trang
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data,
    meta: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  };
}