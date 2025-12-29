import { PracticeCard } from './PracticeCard'
import { type PracticeExercise } from '@/types/practice'
import { RefreshCw } from 'lucide-react'

export function PracticeList({ data }: { data: PracticeExercise[] }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {data.map((item) => (
          <PracticeCard key={item.id} item={item} />
        ))}
      </div>
      
      <div className="flex justify-center mb-16">
         <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-500 transition-colors">
            <RefreshCw className="h-4 w-4" /> Xem thêm bài tập
         </button>
      </div>
    </>
  )
}