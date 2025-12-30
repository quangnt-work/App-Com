// src/app/(admin)/admin/courses/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteCourse(courseId: string) {
  const supabase = await createClient()

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