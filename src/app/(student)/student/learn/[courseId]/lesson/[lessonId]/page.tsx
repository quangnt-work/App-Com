import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import parse from 'html-react-parser' // Import thư viện parse HTML

// CSS để style cho nội dung bài học (Tailwind Typography)
// Cần cài đặt: npm install -D @tailwindcss/typography và thêm vào tailwind.config.ts plugin
// plugins: [require('@tailwindcss/typography')],

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const supabase = await createClient()

  // Lấy nội dung bài học
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', params.lessonId)
    .single()

  if (!lesson) return notFound()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <div className="flex gap-4 mt-2 text-slate-500 text-sm">
           <span>Cập nhật: {new Date(lesson.created_at).toLocaleDateString('vi-VN')}</span>
           <span>•</span>
           <span>Thời lượng: {lesson.duration} phút</span>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ NỘI DUNG ĐỘNG */}
      <article className="prose prose-slate lg:prose-lg max-w-none">
        {/* Hàm parse sẽ biến chuỗi HTML thành React Component */}
        {parse(lesson.content || '<p>Chưa có nội dung</p>')}
      </article>

      {/* Khu vực bài tập (Tiếp theo) */}
      <div className="mt-12 p-6 bg-sky-50 rounded-xl border border-sky-100">
         <h3 className="font-bold text-sky-900 mb-2">Bài tập thực hành</h3>
         <p className="text-sky-700 mb-4">Hoàn thành bài học để mở khóa bài tập trắc nghiệm.</p>
         <button className="bg-sky-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-sky-600 transition">
           Làm bài tập ngay
         </button>
      </div>
    </div>
  )
}