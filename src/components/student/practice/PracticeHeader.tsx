import { Target } from 'lucide-react'

export function PracticeHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Thư viện bài tập</h1>
        <p className="text-slate-500">
          Cải thiện kỹ năng của bạn với hàng ngàn bài tập thực hành đa dạng theo chủ đề và cấp độ. 
          Hoàn thành bài tập để nhận điểm thưởng!
        </p>
      </div>

      {/* Daily Goal Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[280px]">
        {/* Circle Progress (CSS Pure) */}
        <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-sky-100 text-sky-600 font-bold text-xs">
           75%
           <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
             <path className="text-sky-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             <path className="text-sky-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
           </svg>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Mục tiêu ngày</h4>
          <p className="text-xs text-slate-500">3/4 bài tập hoàn thành</p>
        </div>
      </div>
    </div>
  )
}