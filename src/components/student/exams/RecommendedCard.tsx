import { Badge } from '@/components/ui/badge' // Dùng shadcn Badge nếu có, hoặc tạo custom
import { Button } from '@/components/ui/button'
import { Clock, FileText } from 'lucide-react'
import { type Exam } from '@/types/exam'

export function RecommendedCard({ exam }: { exam: Exam }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
      {/* Icon Box */}
      <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl ${exam.bg_color_class || 'bg-slate-100'} flex items-center justify-center flex-shrink-0 text-3xl`}>
         {exam.icon_char}
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <div className="flex gap-2 mb-2">
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            {exam.subject}
          </span>
          {exam.tags?.map(tag => (
             <span key={tag} className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
               {tag}
             </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{exam.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
           <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {exam.duration} phút</span>
           <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {exam.question_count} câu</span>
        </div>

        <Button className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 rounded-full px-6 h-9 text-sm">
           Bắt đầu ngay
        </Button>
      </div>
    </div>
  )
}