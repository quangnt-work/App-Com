'use client'

import { useMemo } from 'react'
import { X, Clock, FileText, CheckCircle2, LayoutList, AlignLeft, ArrowUpDown, AlertTriangle, Volume2, HelpCircle } from "lucide-react"
import parse from 'html-react-parser'

// Helper: Map loại câu hỏi
const getQuestionTypeConfig = (type: string) => {
    switch (type) {
        case 'multiple_choice':
            return { label: 'Trắc nghiệm', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 };
        case 'essay':
            return { label: 'Tự luận', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: AlignLeft };
        case 'reading':
        case 'group':
            return { label: 'Bài Đọc/Nghe', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };
        case 'reorder':
            return { label: 'Sắp xếp câu', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: ArrowUpDown };
        case 'error_id':
            return { label: 'Tìm lỗi sai', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertTriangle };
        case 'fill_in_blank':
             return { label: 'Điền từ', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: LayoutList };
        default:
            return { label: 'Khác', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: HelpCircle };
    }
}

// Helper: Gom nhóm câu hỏi (Flat -> Nested)
const buildPreviewTree = (flatQuestions: any[]) => {
    if (!flatQuestions || flatQuestions.length === 0) return [];
    
    const roots: any[] = [];
    const childrenMap: Record<string, any[]> = {};
  
    // 1. Phân loại cha/con
    flatQuestions.forEach(q => {
      if (q.parent_id) {
        if (!childrenMap[q.parent_id]) childrenMap[q.parent_id] = [];
        childrenMap[q.parent_id].push(q);
      } else {
        roots.push(q);
      }
    });
  
    // 2. Gán con vào cha
    return roots.map(root => ({
        ...root,
        sub_questions: childrenMap[root.id] 
            ? childrenMap[root.id].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) 
            : []
    })).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
};

// Helper: Parse HTML an toàn
const safeParse = (content: string) => {
    if (!content) return <span className="text-slate-400 italic">(Nội dung trống)</span>;
    try {
        return parse(content);
    } catch (e) {
        return <span>{content}</span>;
    }
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    exam: any;
    questions: any[];
}

export function ExamPreviewModal({ isOpen, onClose, exam, questions }: Props) {
    const groupedQuestions = useMemo(() => buildPreviewTree(questions), [questions]);

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
                
                {/* HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/95 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{exam.title}</h2>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                <Clock className="w-3.5 h-3.5 text-sky-500" /> {exam.duration} phút
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                <LayoutList className="w-3.5 h-3.5 text-purple-500" /> {questions.length} câu hỏi
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white scroll-smooth">
                    {groupedQuestions.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">Chưa có câu hỏi nào.</div>
                    ) : (
                        groupedQuestions.map((q: any, idx: number) => {
                            const isGroup = q.type === 'group';
                            
                            // === CASE 1: RENDER GROUP (BÀI ĐỌC/NGHE) ===
                            if (isGroup) {
                                return (
                                    <div key={q.id || idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30 mb-8">
                                        <div className="p-6 bg-white border-b border-slate-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                                    {q.media_url ? <Volume2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                    {q.media_url ? 'Listening' : 'Reading'}
                                                </span>
                                            </div>
                                            {q.media_url && (
                                                <audio controls className="w-full mb-4 h-8"><source src={q.media_url} type="audio/mpeg" /></audio>
                                            )}
                                            <div className="prose prose-sm max-w-none text-slate-800">
                                                {safeParse(q.content)}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-6 bg-slate-50">
                                            {q.sub_questions?.map((sub: any, sIdx: number) => (
                                                <div key={sub.id || sIdx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
                                                    <div className="absolute -left-3 top-5 w-3 h-[2px] bg-slate-300"></div>
                                                    <div className="flex gap-2 mb-3 font-bold text-sm text-slate-900">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 h-fit whitespace-nowrap">Câu {sIdx + 1}</span>
                                                        <div className="flex-1">{safeParse(sub.content)}</div>
                                                    </div>
                                                    {renderOptions(sub)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            // === CASE 2: RENDER CÂU LẺ (SINGLE QUESTION) ===
                            const typeConfig = getQuestionTypeConfig(q.type);
                            
                            return (
                                <div key={q.id || idx} className="group border border-slate-200 rounded-xl p-5 mb-6 shadow-sm hover:border-sky-300 transition-colors bg-white">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-sky-500 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                                                {idx + 1}
                                            </span>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${typeConfig.color}`}>
                                                {typeConfig.icon && <typeConfig.icon className="w-3 h-3" />}
                                                {typeConfig.label}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{q.score} điểm</span>
                                        </div>
                                    </div>
                                    
                                    {/* Nội dung câu hỏi lẻ */}
                                    <div className="text-slate-800 text-sm leading-relaxed mb-4 pl-1 prose prose-sm max-w-none">
                                        {safeParse(q.content)}
                                    </div>

                                    {/* Đáp án câu hỏi lẻ */}
                                    <div className="pl-1 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                                        {renderOptions(q)}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                
                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-sm transition-colors shadow-sm">Đóng</button>
                </div>
            </div>
        </div>
    )
}

// Helper render đáp án (Dùng chung cho cả Single và Sub-question)
function renderOptions(q: any) {
    if (q.type === 'multiple_choice' && q.options && Array.isArray(q.options)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt: string, oIdx: number) => {
                    const isCorrect = q.correct_answer === oIdx.toString();
                    return (
                        <div key={oIdx} className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-colors ${isCorrect ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200'}`}>
                            <span className={`flex-shrink-0 font-bold text-xs w-6 h-6 flex items-center justify-center rounded border ${isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className={isCorrect ? 'text-emerald-900 font-medium' : 'text-slate-600'}>{opt}</span>
                            {isCorrect && <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded border border-emerald-100">ĐÚNG</span>}
                        </div>
                    )
                })}
            </div>
        )
    }
    
    if (q.type === 'fill_in_blank') {
        return (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 p-3 rounded-lg">
                <LayoutList className="w-4 h-4 text-slate-400" />
                <span>Đáp án cần điền:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{q.correct_answer}</span>
            </div>
        )
    }

    if (q.type === 'reorder' && q.options) {
        return (
            <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase">Thứ tự đúng:</p>
                 <div className="flex flex-wrap gap-2">
                    {q.options.map((opt: string, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-700 font-medium shadow-sm">
                            <span className="text-slate-400 mr-2">{idx + 1}.</span>{opt}
                        </div>
                    ))}
                 </div>
            </div>
        )
    }

    if ((q.type === 'essay' || q.type === 'reading' || q.type === 'error_id') && q.explanation) {
        return (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-slate-700">
                <p className="text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1">
                    <AlignLeft className="w-3 h-3" /> Gợi ý / Đáp án mẫu
                </p>
                <div className="whitespace-pre-line">{q.explanation}</div>
            </div>
        )
    }
    
    return null;
}