'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export type UserProfile = {
  id: string;
  email?: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'student';
  created_at: string;
};

interface GetUsersParams {
  page: number;
  pageSize: number;
  query: string;
  role: string;
}

export async function getUsers({ page, pageSize, query, role }: GetUsersParams) {
  const supabase = await createClient();
  
  // Tính toán phân trang
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Khởi tạo query
  let dbQuery = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .range(start, end)
    .order('created_at', { ascending: false });

  // Xử lý tìm kiếm (Search)
  if (query) {
    const searchTerm = query.trim();
    // Tìm trong tên, email hoặc username
    dbQuery = dbQuery.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
  }

  // Xử lý lọc (Filter)
  if (role && role !== 'ALL') {
    dbQuery = dbQuery.eq('role', role);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    console.error("Supabase Error (getUsers):", error);
    return { 
      data: [], 
      count: 0, 
      error: "Không thể tải danh sách người dùng." 
    };
  }

  return { 
    data: data as UserProfile[], 
    count: count || 0, 
    error: null 
  };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  
  try {
    // 1. Check Auth & Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Bạn chưa đăng nhập." };

    // Lấy role của người đang thực hiện thao tác
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (currentUserProfile?.role !== 'admin') {
      return { success: false, message: "Bạn không có quyền xóa người dùng." };
    }

    // 2. Thực hiện xóa (Lưu ý: Cần xóa cả bên Auth nếu dùng Supabase Auth Admin API, 
    // nhưng ở đây ta giả định xóa profile trước)
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    
    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true, message: "Xóa người dùng thành công." };
    
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, message: error.message || "Lỗi khi xóa người dùng." };
  }
}