import { ExamCard } from './ExamCard'
import { type Exam } from '@/types/exam'
import { Inbox } from 'lucide-react' // Icon dùng cho empty state

// Định nghĩa Props rõ ràng
interface ExamListProps {
  exams: Exam[];
  title?: string;
  className?: string;
}

export function ExamList({ exams, title, className }: ExamListProps) {
  // 1. Trường hợp không có dữ liệu (Empty State)
  if (!exams || exams.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="flex justify-center mb-4">
           <div className="bg-slate-50 p-4 rounded-full">
             <Inbox className="h-10 w-10 text-slate-400" />
           </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Không tìm thấy bài kiểm tra</h3>
        <p className="text-slate-500 text-sm mt-1">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
      </div>
    )
  }

  // 2. Trường hợp có dữ liệu -> Render Grid
  return (
    <div className={`mb-12 ${className}`}>
      {/* Render tiêu đề nếu có */}
      {title && (
         <h3 className="font-bold text-slate-800 mb-6 text-lg border-l-4 border-sky-500 pl-3">
           {title}
         </h3>
      )}

      {/* Grid Layout Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  )
}