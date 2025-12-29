import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FILTERS = ["Tất cả", "Toán học", "Tiếng Anh", "Vật lý", "Hóa học", "Lịch sử", "Tin học"]

export function ExamFilter() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        {FILTERS.map((filter, index) => (
          <Button 
            key={filter} 
            variant={index === 0 ? "default" : "outline"}
            className={`rounded-full px-6 ${index === 0 ? 'bg-sky-500 hover:bg-sky-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {filter}
          </Button>
        ))}
        <Button variant="outline" className="rounded-full px-4 border-dashed border-slate-300 text-slate-500 flex items-center gap-2">
           <SlidersHorizontal className="h-4 w-4" /> Bộ lọc khác
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <input 
          type="text" 
          placeholder="Tìm theo tên bài, môn học..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm shadow-sm"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
      </div>
    </div>
  )
}