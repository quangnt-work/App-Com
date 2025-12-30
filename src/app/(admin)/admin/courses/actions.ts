// src/app/(admin)/admin/courses/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteCourse(courseId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized: Bạn chưa đăng nhập');
  }

  const role = user.user_metadata.role;
  if (role !== 'admin') {
    throw new Error('Forbidden: Bạn không có quyền thực hiện hành động này');
  }

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}