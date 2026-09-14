// src/components/student/lessons/LessonCard.tsx
import Link from 'next/link'
import { FileText, MonitorPlay, ExternalLink } from 'lucide-react'
import { type Grammar } from '@/types/grammar'

interface GrammarCardProps {
  grammar: Grammar;
  index: number;
}

export function GrammarCard({ grammar, index }: GrammarCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 flex flex-col hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group h-full relative">
      {/* Header Card: Icon & Số thứ tự bài */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-2xs">
          <FileText className="w-4.5 h-4.5" />
        </div>
        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50/90 border border-blue-100 uppercase tracking-wider px-2.5 py-0.5 rounded-md">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tên bài học */}
      <h3 className="font-extrabold text-slate-900 mb-1 text-sm sm:text-[15px] line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug min-h-[2.5rem]">
        {grammar.title || `Bài ${index + 1}: Tiêu đề bài học`}
      </h3>

      {/* Loại tài liệu */}
      <div className="flex items-center text-[11px] text-slate-500 mb-2.5 font-medium">
        <MonitorPlay className="w-3.5 h-3.5 text-blue-500 mr-1.5 shrink-0" />
        <span>Tài liệu bài giảng</span>
      </div>

      {/* Nút Xem ngay */}
      <div className="mt-auto pt-1">
        <Link 
          href={`/student/lessons/grammars/${grammar.id}`} 
          className="h-9 flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xs shadow-blue-500/20 hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all text-xs uppercase tracking-wider"
        >
          <span>Xem bài học</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  )
}