'use client'

import { Search, Filter, ChevronDown } from 'lucide-react'

export function ExamFilters() {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
      {/* Search */}
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Tìm kiếm tên đề thi..." 
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        />
      </div>

      {/* Filter Groups */}
      <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
        <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer hover:bg-slate-50 transition-colors">
            <option>Môn học: Tất cả</option>
            <option>Toán học</option>
            <option>Vật lý</option>
            <option>Tiếng Anh</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer hover:bg-slate-50 transition-colors">
            <option>Cấp độ: Tất cả</option>
            <option>Dễ</option>
            <option>Trung bình</option>
            <option>Khó</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer hover:bg-slate-50 transition-colors">
            <option>Trạng thái: Tất cả</option>
            <option>Công khai</option>
            <option>Nháp</option>
            <option>Đang ẩn</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}