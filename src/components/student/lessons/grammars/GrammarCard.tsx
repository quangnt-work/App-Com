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
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5 hover:-translate-y-0.5 transition-all duration-200 group h-full">
      {/* Header Card: Icon & Số thứ tự bài */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
          <FileText className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
          BÀI {index + 1}
        </span>
      </div>

      {/* Tên bài học */}
      <h3 className="font-bold text-slate-800 mb-1.5 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
        {grammar.title || `Bài ${index + 1}: Tiêu đề bài học`}
      </h3>

      {/* Loại tài liệu */}
      <div className="flex items-center text-[11px] text-slate-400 mb-3 font-medium">
        <MonitorPlay className="w-3 h-3 text-blue-500 mr-1.5 shrink-0" />
        <span>Tài liệu bài giảng</span>
      </div>

      {/* Nút Xem ngay */}
      <div className="mt-auto">
        <Link 
          href={`/student/lessons/grammars/${grammar.id}`} 
          className="flex items-center justify-center w-full py-2 bg-blue-50/80 text-blue-600 font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-xs transition-all text-xs"
        >
          Xem bài học <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  )
}