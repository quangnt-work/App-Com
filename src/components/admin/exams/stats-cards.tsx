'use client'

import React, { useMemo } from 'react'
import { LayoutList, CheckSquare, AlignLeft, HelpCircle } from 'lucide-react'

interface Props {
  questions: any[];
}

export function StatsCards({ questions }: Props) {
  // Sử dụng useMemo để tự động tính toán lại khi danh sách câu hỏi thay đổi
  const stats = useMemo(() => {
    return {
      total: questions.length,
      multipleChoice: questions.filter(q => q.type === 'multiple_choice').length,
      essay: questions.filter(q => q.type === 'essay').length,
      others: questions.filter(q => !['multiple_choice', 'essay'].includes(q.type)).length
    }
  }, [questions])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Tổng số */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
            <LayoutList className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng câu hỏi</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
        </div>
      </div>

      {/* Card 2: Trắc nghiệm */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shadow-sm">
            <CheckSquare className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trắc nghiệm</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.multipleChoice}</p>
        </div>
      </div>

      {/* Card 3: Tự luận & Khác */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
            {stats.others > 0 ? <HelpCircle className="w-6 h-6" /> : <AlignLeft className="w-6 h-6" />}
        </div>
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tự luận / Khác</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.essay + stats.others}</p>
        </div>
      </div>
    </div>
  )
}