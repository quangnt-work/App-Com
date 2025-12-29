import { Book, Languages, FileText, Headphones, Clock, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type PracticeExercise, type CategoryConfig, type PracticeCategory } from '@/types/practice'

// Map cấu hình màu sắc và icon
const CATEGORY_MAP: Record<PracticeCategory, CategoryConfig> = {
  GRAMMAR: { label: 'Ngữ pháp', color: 'text-sky-600', bgColor: 'bg-sky-50', badgeColor: 'bg-sky-100 text-sky-700', icon: Book },
  VOCAB: { label: 'Từ vựng', color: 'text-orange-600', bgColor: 'bg-orange-50', badgeColor: 'bg-orange-100 text-orange-700', icon: Languages },
  READING: { label: 'Đọc hiểu', color: 'text-emerald-600', bgColor: 'bg-emerald-50', badgeColor: 'bg-emerald-100 text-emerald-700', icon: FileText },
  LISTENING: { label: 'Nghe', color: 'text-purple-600', bgColor: 'bg-purple-50', badgeColor: 'bg-purple-100 text-purple-700', icon: Headphones },
}

// Map màu cho độ khó
const DIFFICULTY_COLOR = {
  'Dễ': 'bg-green-100 text-green-700',
  'Trung bình': 'bg-yellow-100 text-yellow-700',
  'Khó': 'bg-red-100 text-red-700',
}

export function PracticeCard({ item }: { item: PracticeExercise }) {
  const config = CATEGORY_MAP[item.category];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Header màu */}
      <div className={`h-24 ${config.bgColor} relative p-4 flex justify-between items-start`}>
         <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-white ${config.color}`}>
            {config.label}
         </span>
         <span className={`text-[10px] font-bold px-2 py-1 rounded ${DIFFICULTY_COLOR[item.difficulty]}`}>
            {item.difficulty}
         </span>
         
         {/* Icon chính giữa */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Icon className={`h-10 w-10 ${config.color} opacity-80`} />
            {item.is_premium && (
               <div className="absolute -top-2 -right-2 bg-slate-100 rounded-full p-1 border border-white shadow-sm">
                  <Lock className="h-3 w-3 text-slate-400" />
               </div>
            )}
         </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
         <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{item.title}</h3>
         <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{item.description}</p>

         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
               <Clock className="h-4 w-4" /> {item.duration} phút
            </div>

            {item.is_premium ? (
               <Button variant="secondary" className="h-8 px-4 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold">
                  Nâng cấp
               </Button>
            ) : (
               <Button className="h-8 px-4 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-bold">
                  Bắt đầu
               </Button>
            )}
         </div>
      </div>
    </div>
  )
}