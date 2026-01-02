'use client'

import React from 'react'
import { PlusCircle, CloudUpload } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import các component con
import { QuestionItem } from './QuestionItem'
import { QuestionForm } from './QuestionForm'

interface Props {
  questions: any[];
  editingIndex: number | null; // null: không sửa, -1: đang tạo mới, 0...n: index đang sửa
  setEditingIndex: (index: number | null) => void;
  onSave: (questionData: any) => void;
  onDelete: (index: number) => void;
}

export function QuestionList({ questions, editingIndex, setEditingIndex, onSave, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
      
      {/* HEADER CỦA LIST */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
            Nội dung đề thi 
            <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs font-bold border border-sky-200">
              {questions.length} câu
            </span>
        </h3>
        <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-600">
                <CloudUpload className="w-4 h-4 mr-2" /> Import Excel
            </Button>
            <Button 
                size="sm" 
                onClick={() => setEditingIndex(-1)} 
                disabled={editingIndex !== null} // Disable nếu đang sửa câu khác
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20"
            >
                <PlusCircle className="w-4 h-4 mr-2" /> Thêm câu hỏi
            </Button>
        </div>
      </div>

      {/* BODY CỦA LIST */}
      <div className="p-6 space-y-6 flex-1">
        
        {/* CASE 1: ĐANG TẠO MỚI (Form hiện ở đầu danh sách hoặc modal riêng - ở đây để đầu cho dễ thấy) */}
        {editingIndex === -1 && (
            <div className="animate-in slide-in-from-top-4 duration-300">
                <QuestionForm 
                    onSave={onSave} 
                    onCancel={() => setEditingIndex(null)} 
                />
            </div>
        )}

        {/* CASE 2: DANH SÁCH CÂU HỎI */}
        {questions.length === 0 && editingIndex === null ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <PlusCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-600">Chưa có câu hỏi nào</p>
                <p className="text-sm">Bấm "Thêm câu hỏi" để bắt đầu soạn đề thi.</p>
            </div>
        ) : (
            questions.map((q, idx) => (
                <div key={q.id || idx} className="transition-all duration-300">
                    {editingIndex === idx ? (
                        // Đang chỉnh sửa câu này -> Hiện Form
                        <QuestionForm 
                            initialData={q} 
                            onSave={onSave} 
                            onCancel={() => setEditingIndex(null)} 
                        />
                    ) : (
                        // Bình thường -> Hiện Item
                        <QuestionItem 
                            question={q} 
                            index={idx} 
                            onEdit={() => setEditingIndex(idx)} 
                            onDelete={() => onDelete(idx)} 
                        />
                    )}
                </div>
            ))
        )}

        {/* NÚT THÊM NHANH Ở CUỐI (Placeholder) */}
        {editingIndex === null && questions.length > 0 && (
            <div 
                onClick={() => setEditingIndex(-1)}
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center hover:border-sky-400 hover:bg-sky-50 cursor-pointer transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white mb-2 transition-colors text-slate-400">
                    <PlusCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500 group-hover:text-sky-600 uppercase tracking-wide">Thêm câu hỏi tiếp theo</p>
            </div>
        )}
      </div>
    </div>
  )
}