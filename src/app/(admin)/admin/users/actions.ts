// src/app/(admin)/admin/users/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: string) {
  const supabase = await createClient()

  try {
    // 1. Xóa user trong bảng profiles
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error

    // 2. (Tùy chọn) Xóa cả trong Supabase Auth nếu cần (yêu cầu quyền Admin Service Role)
    // Lưu ý: Thông thường chỉ cần xóa profile hoặc đánh dấu status = 'deleted'

    // 3. Làm mới dữ liệu trang admin/users mà không cần F5
    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (error) {
    console.error('Lỗi khi xóa user:', error)
    return { success: false, error }
  }
}