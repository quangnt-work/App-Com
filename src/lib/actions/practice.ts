// src/lib/actions/practice.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePracticeSet(id: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.from('practice_sets').delete().eq('id', id)
    
    if (error) throw error
    
    // Làm mới cache của trang quản lý để cập nhật danh sách
    revalidatePath('/admin/practice')
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error }
  }
}