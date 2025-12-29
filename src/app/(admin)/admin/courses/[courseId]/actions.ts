'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteLesson(lessonId: string, courseId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) return { success: false, error: error.message }

  // Refresh lại trang chi tiết khóa học
  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}