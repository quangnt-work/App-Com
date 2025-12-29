import { createClient } from '@/lib/supabase/server'
import { ExamHero } from '@/components/student/exams/ExamHero'
import { ExamFilter } from '@/components/student/exams/ExamFilter'
import { RecommendedCard } from '@/components/student/exams/RecommendedCard'
import { ExamList } from '@/components/student/exams/ExamList'
import { Button } from '@/components/ui/button'
import { ChevronDown, Inbox } from 'lucide-react'

export default async function ExamsPage() {
  const supabase = await createClient()

  const { data: examsData } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })

  const allExams = examsData || []
  const isEmpty = allExams.length === 0

  // Lọc bài đề xuất (dựa vào cột is_recommended trong DB)
  const recommendedExams = allExams.filter(exam => exam.is_recommended)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ExamHero />

      <div className="container mx-auto px-4">
        {isEmpty ? (
           <div className="py-20 text-center">
             <div className="flex justify-center mb-4">
               <div className="bg-white p-6 rounded-full shadow-sm">
                  <Inbox className="h-12 w-12 text-slate-300" />
               </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900">Chưa có bài kiểm tra</h3>
             <p className="text-slate-500 mt-2">Hệ thống đang cập nhật đề thi mới.</p>
           </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-slate-900">Danh sách bài kiểm tra</h2>
            </div>
            <ExamFilter />

            {/* Chỉ hiện mục Đề xuất nếu có bài được đánh dấu recommended */}
            {recommendedExams.length > 0 && (
              <div className="mb-12">
                 <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 text-lg">
                   <span className="text-sky-500">🔥</span> Đề xuất cho bạn
                 </h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    {recommendedExams.map(exam => (
                      <RecommendedCard key={exam.id} exam={exam} />
                    ))}
                 </div>
              </div>
            )}

            <ExamList 
              title="Tất cả bài kiểm tra" 
              exams={allExams} 
            />

            <div className="flex justify-center mt-8">
               <Button variant="outline" className="rounded-full px-6 border-slate-300 text-slate-600 hover:bg-white hover:text-sky-600 gap-2">
                 Xem thêm <ChevronDown className="h-4 w-4" />
               </Button>
            </div>
          </>
        )}
      </div>
      
      <footer className="mt-20 border-t pt-8 pb-8 bg-white text-center text-xs text-slate-400">
         © 2024 E-Learning Hub. All rights reserved.
      </footer>
    </div>
  )
}