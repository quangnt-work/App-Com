import { Search } from 'lucide-react'

export function DocumentFilters() {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên tài liệu, tác giả..." 
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex gap-3 w-full md:w-auto">
        <select className="px-4 py-2.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-600 outline-none cursor-pointer hover:bg-slate-100">
          <option>Tất cả định dạng</option>
          <option>PDF</option>
          <option>Word</option>
          <option>Excel</option>
        </select>
      </div>
    </div>
  )
}