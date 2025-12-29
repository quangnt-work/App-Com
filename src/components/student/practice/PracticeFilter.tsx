import { Search, Filter, ArrowUpDown, Book, Languages, FileText, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PracticeFilter() {
  return (
    <div className="space-y-6 mb-10">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
           <input 
             type="text" 
             placeholder="Tìm kiếm bài tập (ví dụ: Thi hiện tại đơn, Từ vựng du lịch...)" 
             className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
           />
        </div>
        <Button className="h-full py-3 px-8 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold">
          Tìm kiếm
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         {/* Topic Tabs */}
         <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6">Tất cả</Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-sky-600 bg-sky-50 hover:bg-sky-100 border-none gap-2">
               <Book className="h-4 w-4" /> Ngữ pháp
            </Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-orange-600 bg-orange-50 hover:bg-orange-100 border-none gap-2">
               <Languages className="h-4 w-4" /> Từ vựng
            </Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-none gap-2">
               <FileText className="h-4 w-4" /> Đọc hiểu
            </Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-purple-600 bg-purple-50 hover:bg-purple-100 border-none gap-2">
               <Headphones className="h-4 w-4" /> Nghe
            </Button>
         </div>

         {/* Dropdowns */}
         <div className="flex gap-3">
            <Button variant="outline" className="rounded-lg border-slate-200 text-slate-600 gap-2">
               Cấp độ: Tất cả <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-lg border-slate-200 text-slate-600 gap-2">
               Sắp xếp: Mới nhất <ArrowUpDown className="h-4 w-4" />
            </Button>
         </div>
      </div>
    </div>
  )
}