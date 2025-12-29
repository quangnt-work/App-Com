import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const TABS = ["Tất cả", "Bài giảng", "Đề thi", "Ebook"]

export function DocumentFilter() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        {TABS.map((tab, idx) => (
          <Button
            key={tab}
            variant={idx === 0 ? 'default' : 'outline'}
            className={`rounded-full px-6 ${idx === 0 ? 'bg-slate-900 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Sort Dropdown (Mock) */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
         <span>Sắp xếp:</span>
         <button className="flex items-center gap-2 font-bold text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Mới nhất <ChevronDown className="h-4 w-4" />
         </button>
      </div>
    </div>
  )
}