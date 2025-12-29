import { createClient } from '@/lib/supabase/server'
import { CourseHero } from '@/components/student/courses/CourseHero'
import { CourseSection } from '@/components/student/courses/CourseSection'
import { Button } from '@/components/ui/button'
import { Inbox } from 'lucide-react'

// Hàm lấy dữ liệu từ DB
async function getCourses() {
  const supabase = await createClient()
  
  // Lấy tất cả khóa học, sắp xếp mới nhất lên đầu
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return data || []
}

export default async function CoursesPage() {
  // 1. Fetch dữ liệu thật
  const allCourses = await getCourses()

  // 2. Phân loại khóa học (Filtering in Memory)
  // Lưu ý: Nếu dữ liệu lớn, nên filter từ câu query Supabase. Với demo nhỏ thì filter JS ok.
  const englishCourses = allCourses.filter(c => c.category === 'TIẾNG ANH')
  const russianCourses = allCourses.filter(c => c.category === 'TIẾNG NGA')
  const itCourses = allCourses.filter(c => c.category === 'CNTT')
  const otherCourses = allCourses.filter(c => c.category === 'KHÁC')

  // 3. Kiểm tra Empty State (Nếu cả DB trống trơn)
  const isEmpty = allCourses.length === 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero luôn hiển thị để trang không bị trống hơ trống hoác */}
      <CourseHero />

      {/* CASE 1: Chưa có bài giảng nào trong DB */}
      {isEmpty && (
        <div className="container mx-auto px-4 py-20 text-center">
           <div className="flex justify-center mb-4">
             <div className="bg-slate-50 p-6 rounded-full">
               <Inbox className="h-12 w-12 text-slate-300" />
             </div>
           </div>
           <h3 className="text-xl font-bold text-slate-900">Chưa có khóa học nào</h3>
           <p className="text-slate-500 mt-2">Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      )}

      {/* CASE 2: Hiển thị các Section (Chỉ hiện nếu có bài) */}
      {/* Component CourseSection đã có logic: if empty -> return null */}
      
      <CourseSection 
        title="Khóa tiếng Anh" 
        icon="english"
        courses={englishCourses} 
      />

      <CourseSection 
        title="Khóa tiếng Nga" 
        icon="russian"
        courses={russianCourses} 
      />

       <CourseSection 
        title="Công nghệ thông tin" 
        icon="it"
        courses={itCourses} 
      />

      <CourseSection 
        title="Khóa học khác" 
        icon="other"
        courses={otherCourses} 
      />

      {/* Chỉ hiện nút Xem thêm nếu có ít nhất 1 khóa học */}
      {!isEmpty && (
        <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50 px-8 rounded-full">
            Xem tất cả khóa học ↓
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