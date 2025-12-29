// src/app/(admin)/admin/users/[id]/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function gradeSubmission(
  submissionId: string, 
  score: number, 
  feedback: string,
  userId: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('submissions')
    .update({
      score: score,
      feedback: feedback,
      status: 'graded', // Cập nhật trạng thái thành đã chấm
    })
    .eq('id', submissionId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Làm mới dữ liệu trang hiện tại
  revalidatePath(`/admin/users/${userId}`)
  return { success: true }
}