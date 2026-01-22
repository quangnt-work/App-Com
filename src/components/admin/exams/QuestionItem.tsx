import React, { useState } from 'react'
import { Question } from '@/types/exam-custom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Edit3, Trash2, Volume2, FileText, CheckCircle2, AlignLeft } from 'lucide-react'

interface QuestionItemProps {
  index: number;
  displayIndex: number;
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionItem({ index, displayIndex, question, onEdit, onDelete }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper: Icon theo loại
  const getIcon = (type: string, mediaType?: string) => {
      if (type === 'group') return mediaType === 'audio' ? <Volume2 className="w-3 h-3"/> : <FileText className="w-3 h-3"/>;
      if (type === 'essay' || type === 'fill_in_blank') return <AlignLeft className="w-3 h-3"/>;
      return <CheckCircle2 className="w-3 h-3"/>;
  }

  // Helper: Label theo loại
  const getLabel = (type: string) => {
      const map: Record<string, string> = {
          multiple_choice: 'Trắc nghiệm',
          essay: 'Tự luận',
          fill_in_blank: 'Điền từ',
          group: 'Nhóm câu hỏi'
      };
      return map[type] || type;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* HEADER */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 font-bold text-slate-500 text-sm shadow-sm">
            {displayIndex}
          </div>
          
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex gap-1 items-center bg-white text-slate-700 font-medium border-slate-300 shrink-0">
                {getIcon(question.type, question.media_type)}
                {getLabel(question.type)}
              </Badge>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 shrink-0">
                {question.type === 'group' ? `${question.sub_questions?.length || 0} câu nhỏ` : `${question.score} đ`}
              </span>
            </div>
            
            {!isExpanded && (
              <p className="text-slate-600 text-sm line-clamp-1 font-medium truncate">
                {question.content || '(Chưa nhập nội dung)'}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="pl-1">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      </div>

      {/* BODY (EXPANDED) */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200 bg-white">
          
          {/* 1. NỘI DUNG CHÍNH */}
          <div className="mb-6">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {question.type === 'group' ? 'Nội dung bài đọc / nghe' : 'Nội dung câu hỏi'}
             </h4>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                {question.content}
                {question.media_url && (
                    <div className="mt-3 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 flex items-center gap-2">
                        <Volume2 className="w-4 h-4"/> Media: <a href={question.media_url} target="_blank" className="underline">{question.media_url}</a>
                    </div>
                )}
             </div>

             {/* --- [MỚI] HIỂN THỊ ĐÁP ÁN CHO CÂU TỰ LUẬN ĐƠN --- */}
             {(question.type === 'essay' || question.type === 'fill_in_blank') && question.correct_answer && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide block mb-1">
                        Đáp án gợi ý / Từ khóa:
                    </span>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">
                        {question.correct_answer}
                    </div>
                </div>
             )}

             {/* HIỂN THỊ OPTION CHO CÂU TRẮC NGHIỆM ĐƠN */}
             {question.type === 'multiple_choice' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options?.map((opt, i) => (
                        <div key={i} className={`p-3 rounded border text-sm flex items-center gap-3 ${question.correct_answer === opt ? 'bg-green-50 border-green-200 text-green-800 font-medium ring-1 ring-green-200' : 'bg-white border-slate-100 text-slate-600'}`}>
                            <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs border ${question.correct_answer === opt ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                        </div>
                    ))}
                </div>
             )}
          </div>

          {/* 2. SUB QUESTIONS (CHO GROUP) */}
          {question.type === 'group' && question.sub_questions && question.sub_questions.length > 0 && (
             <div className="border-t border-slate-100 pt-4 mt-4">
                 <h4 className="text-sm font-bold text-purple-700 mb-4 flex items-center gap-2">
                    Các câu hỏi đi kèm ({question.sub_questions.length})
                 </h4>
                 
                 <div className="space-y-6 pl-4 border-l-2 border-purple-100 ml-1">
                    {question.sub_questions.map((sub, sIdx) => (
                        <div key={sIdx} className="relative group/sub">
                            {/* Marker số thứ tự */}
                            <div className="absolute -left-[25px] top-0 w-5 h-5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold flex items-center justify-center border border-purple-200">
                                {sIdx + 1}
                            </div>
                            
                            {/* Nội dung câu con */}
                            <div className="mb-2">
                                <Badge variant="secondary" className="mr-2 text-[10px] h-5 px-1">{getLabel(sub.type)}</Badge>
                                <span className="font-bold text-slate-800 text-sm">{sub.content}</span>
                                <span className="text-xs text-slate-400 ml-2">({sub.score} điểm)</span>
                            </div>

                            {/* Options câu con (Trắc nghiệm) */}
                            {sub.type === 'multiple_choice' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    {sub.options?.map((opt, oIdx) => (
                                        <div key={oIdx} className={`px-3 py-2 text-xs rounded border ${sub.correct_answer === opt ? 'bg-green-50 border-green-200 text-green-700 font-semibold' : 'border-slate-100 text-slate-600'}`}>
                                            <span className="font-bold mr-2">{String.fromCharCode(65+oIdx)}.</span>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- [MỚI] HIỂN THỊ ĐÁP ÁN CHO CÂU CON TỰ LUẬN --- */}
                            {(sub.type === 'essay' || sub.type === 'fill_in_blank') && sub.correct_answer && (
                                <div className="mt-2 p-2 bg-green-50/50 border border-green-100 rounded text-xs text-green-800">
                                    <span className="font-bold mr-2">Đáp án:</span> 
                                    {sub.correct_answer}
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
             </div>
          )}

          {/* 3. EXPLANATION */}
          {question.explanation && (
            <div className="mt-5 pt-3 border-t border-dashed border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Giải thích chi tiết:</span>
                <p className="text-sm text-slate-600 mt-1 italic bg-yellow-50/50 p-2 rounded">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}