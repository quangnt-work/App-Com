'use client'

import React from 'react'
import { Edit, Trash2, GripVertical, Volume2, FileText, AlignLeft, LayoutList } from 'lucide-react'
import parse from 'html-react-parser'

const TYPE_LABELS: any = {
    multiple_choice: { label: 'Trắc nghiệm', color: 'bg-blue-100 text-blue-700' },
    essay: { label: 'Tự luận', color: 'bg-emerald-100 text-emerald-700' },
    reorder: { label: 'Sắp xếp', color: 'bg-orange-100 text-orange-700' },
    error_id: { label: 'Tìm lỗi', color: 'bg-purple-100 text-purple-700' },
    fill_in_blank: { label: 'Điền từ', color: 'bg-pink-100 text-pink-700' },
    group: { label: 'Bài đọc/nghe', color: 'bg-slate-100 text-slate-700' }
}

export function QuestionItem({ question, index, onEdit, onDelete }: any) {
    
    // --- CASE 1: RENDER CHO NHÓM (BÀI ĐỌC / NGHE) ---
    if (question.type === 'group') {
        return (
            <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 mb-6 shadow-sm">
                {/* Header Context */}
                <div className="bg-white p-6 border-b border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded text-xs uppercase tracking-wide flex items-center gap-1">
                                {question.media_url ? <Volume2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                {question.media_url ? 'Bài Nghe' : 'Bài Đọc'}
                            </span>
                            <span className="text-slate-400 text-xs font-medium">Chứa {question.sub_questions?.length || 0} câu hỏi</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={onEdit} className="text-xs text-sky-600 font-bold hover:underline px-2">Sửa bài</button>
                            <button onClick={onDelete} className="text-xs text-red-600 font-bold hover:underline px-2">Xóa bài</button>
                        </div>
                    </div>

                    {question.media_url && (
                        <audio controls className="w-full mb-4 h-8">
                            <source src={question.media_url} type="audio/mpeg" />
                        </audio>
                    )}

                    <div className="prose prose-sm max-w-none text-slate-800 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                        {question.content ? parse(question.content) : <span className="text-slate-400 italic">Chưa có nội dung bài đọc</span>}
                    </div>
                </div>

                {/* Sub Questions List */}
                <div className="p-4 space-y-3 bg-slate-50">
                    {question.sub_questions?.length > 0 ? (
                        question.sub_questions.map((sub: any, sIdx: number) => (
                            <div key={sIdx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm ml-4 relative">
                                <div className="absolute -left-7 top-4 w-6 h-[2px] bg-slate-300"></div>
                                <div className="font-bold text-sm text-slate-900 mb-2 flex gap-2">
                                    <span className="bg-slate-100 px-1.5 rounded text-slate-600 whitespace-nowrap">Câu {sIdx + 1}</span>
                                    <span>{sub.content}</span>
                                </div>
                                {/* Reuse render logic for sub-question answers */}
                                {renderAnswerSection(sub)}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-xs text-slate-400 py-2">Chưa có câu hỏi con nào</div>
                    )}
                </div>
            </div>
        )
    }

    // --- CASE 2: RENDER CHO CÂU LẺ (Mặc định) ---
    const typeConfig = TYPE_LABELS[question.type] || TYPE_LABELS.multiple_choice

    return (
        <div className="group border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-md transition-all bg-white relative mb-4">
            {/* Header: Badges & Actions */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-slate-300 cursor-move" />
                    <span className="font-bold text-slate-900">Câu {index + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${typeConfig.color}`}>
                        {typeConfig.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {question.score} điểm
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        question.difficulty === 'easy' ? 'text-green-600 bg-green-50' : 
                        question.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                    }`}>
                        {question.difficulty || 'medium'}
                    </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="pl-8 text-sm text-slate-800 prose prose-sm max-w-none mb-3">
                {question.content ? parse(question.content) : <span className="text-slate-400 italic">Chưa có nội dung câu hỏi</span>}
            </div>

            {/* Answer Section */}
            <div className="pl-8">
                {renderAnswerSection(question)}
            </div>
        </div>
    )
}

// Hàm render vùng hiển thị đáp án (Dùng chung cho cả câu lẻ và câu con)
function renderAnswerSection(question: any) {
    // 1. TRẮC NGHIỆM
    if (question.type === 'multiple_choice' && question.options) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt: string, idx: number) => (
                    <div key={idx} className={`text-xs px-3 py-2 rounded border flex items-center gap-2 ${
                        question.correct_answer === idx.toString() ? 'bg-green-50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                        <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold border ${
                            question.correct_answer === idx.toString() ? 'bg-green-500 text-white border-green-500' : 'bg-white border-slate-200'
                        }`}>
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                    </div>
                ))}
            </div>
        )
    }

    // 2. SẮP XẾP CÂU (Fix: Hiển thị list các thành phần cần sắp xếp)
    if (question.type === 'reorder' && question.options) {
        return (
            <div className="flex flex-wrap gap-2">
                {question.options.map((opt: string, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span> {opt}
                    </div>
                ))}
            </div>
        )
    }

    // 3. ĐIỀN TỪ (Fix: Hiển thị đáp án đúng)
    if (question.type === 'fill_in_blank') {
        return (
            <div className="flex items-center gap-2 text-xs bg-pink-50 border border-pink-100 p-2 rounded text-pink-900 w-fit">
                <LayoutList className="w-3 h-3" />
                <span>Đáp án:</span>
                <span className="font-bold">{question.correct_answer}</span>
            </div>
        )
    }

    // 4. TỰ LUẬN / TÌM LỖI SAI (Fix: Hiển thị gợi ý/đáp án mẫu)
    if ((question.type === 'essay' || question.type === 'error_id') && question.explanation) {
        return (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-slate-700 mt-2">
                <p className="font-bold text-amber-700 uppercase mb-1 flex items-center gap-1">
                    <AlignLeft className="w-3 h-3" /> Gợi ý / Đáp án
                </p>
                <div className="whitespace-pre-line">{question.explanation}</div>
            </div>
        )
    }

    return null;
}