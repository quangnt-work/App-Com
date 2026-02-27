import { LessonHero } from '@/components/student/lessons/LessonHero'
import { LessonSection } from '@/components/student/lessons/LessonSection'
import { Button } from '@/components/ui/button'
import { Inbox } from 'lucide-react'
import { LessonRepository } from "@/repositories/lesson-repository";
import { type Lesson } from '@/types/lesson'

export default async function LessonsPage() {
  // 1. Fetch dữ liệu thật
  const [englishLessons, russianLessons, itLessons, otherLessons] = await Promise.all([
    LessonRepository.getByCategory('TIẾNG ANH'),
    LessonRepository.getByCategory('TIẾNG NGA'),
    LessonRepository.getByCategory('CNTT'),
    LessonRepository.getByCategory('KHÁC')
  ]);

  const isEmpty = 
    (englishLessons.data?.length || 0) === 0 && 
    (russianLessons.data?.length || 0) === 0 &&
    (itLessons.data?.length || 0) === 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      <LessonHero />

      {isEmpty && (
        <div className="container mx-auto px-4 py-20 text-center">
           <div className="flex justify-center mb-4">
             <div className="bg-slate-50 p-6 rounded-full">
               <Inbox className="h-12 w-12 text-slate-300" />
             </div>
           </div>
           <h3 className="text-xl font-bold text-slate-900">Chưa có bài học nào</h3>
           <p className="text-slate-500 mt-2">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      )}
      
      <LessonSection 
        title="Khóa tiếng Nga" 
        icon="english"
        lessons={(russianLessons.data as unknown as Lesson[]) || []} 
      />

      <LessonSection 
        title="Khóa tiếng Anh" 
        icon="russian"
        lessons={(englishLessons.data as unknown as Lesson[]) || []} 
      />

       <LessonSection 
        title="Công nghệ thông tin" 
        icon="it"
        lessons={(itLessons.data as unknown as Lesson[]) || []} 
      />

      <LessonSection 
        title="Bài học khác" 
        icon="other"
        lessons={(otherLessons.data as unknown as Lesson[]) || []} 
      />

      {!isEmpty && (
        <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50 px-8 rounded-full">
            Xem tất cả bài học ↓
            </Button>
        </div>
      )}

      <footer className="mt-20 border-t pt-12 pb-8 bg-slate-50">
         <div className="container mx-auto px-4 text-center space-y-4">
            <p className="text-xs text-slate-400">© 2024 E-Learning Hub. All rights reserved.</p>
         </div>
      </footer>
    </div>
  )
}