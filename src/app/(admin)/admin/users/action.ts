'use server';

import { createClient } from '@/lib/supabase/server'; 
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  try {
    // Gọi API xóa user (Ví dụ xóa trong bảng profiles)
    // Lưu ý: Nếu xóa user trong Auth (Supabase Auth), bạn cần dùng service_role client
    const { error } = await supabase
      .from('profiles') 
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Database Delete Error:', error);
      return { success: false, message: error.message };
    }

    // Quan trọng: Làm mới cache của trang user để UI cập nhật
    revalidatePath('/admin/users');
    
    return { success: true, message: 'Xóa thành công' };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, message: 'Lỗi hệ thống không xác định' };
  }
}