import { createClient } from '@/lib/supabase/server'
import { PracticeHeader } from '@/components/student/practice/PracticeHeader'
import { PracticeFilter } from '@/components/student/practice/PracticeFilter'
import { PracticeList } from '@/components/student/practice/PracticeList'
import { PracticeStats } from '@/components/student/practice/PracticeStats'
import { Inbox } from 'lucide-react'

export default async function PracticePage() {
  const supabase = await createClient()

  // Fetch dữ liệu thật
  const { data: practiceData, error } = await supabase
    .from('practice_exercises')
    .select('*')
    .order('created_at', { ascending: false })

  const exercises = practiceData || []
  const isEmpty = exercises.length === 0

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <PracticeHeader />
        
        {/* Chỉ hiện Filter và List khi có dữ liệu */}
        {!isEmpty ? (
          <>
            <PracticeFilter />
            <PracticeList data={exercises} />
            <PracticeStats />
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-6 rounded-full shadow-sm">
                 <Inbox className="h-12 w-12 text-slate-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Chưa có bài tập nào</h3>
            <p className="text-slate-500 mt-2">Vui lòng quay lại sau khi Admin cập nhật nội dung.</p>
          </div>
        )}
      </div>
      
      <footer className="mt-12 border-t pt-8 text-center text-xs text-slate-400">
         © 2024 E-Learning Hub. All rights reserved.
      </footer>
    </div>
  )
}