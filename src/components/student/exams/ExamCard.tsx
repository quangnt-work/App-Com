import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Clock, HelpCircle, BarChart } from 'lucide-react'
import { type Exam } from '@/types/exam'

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image 
          src={exam.thumbnail || '/placeholder-exam.jpg'} 
          alt={exam.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {exam.is_new && (
           <span className="absolute top-3 right-3 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
             Mới
           </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
           <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">{exam.subject}</span>
        </div>
        
        <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 min-h-[3rem]">
          {exam.title}
        </h3>
        
        <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">
          {exam.description}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3 mb-4">
           <div className="flex items-center gap-1">
             <Clock className="h-3 w-3" /> {exam.duration}
           </div>
           <div className="flex items-center gap-1">
             <HelpCircle className="h-3 w-3" /> {exam.question_count} câu
           </div>
           <div className="flex items-center gap-1">
             <BarChart className="h-3 w-3" /> {exam.difficulty}
           </div>
        </div>

        <Button variant="secondary" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg h-9 text-sm font-medium">
           Chi tiết
        </Button>
      </div>
    </div>
  )
}