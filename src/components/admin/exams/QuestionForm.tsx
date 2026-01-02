'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/admin/courses/RichTextEditor'
import { Plus, Trash2, Mic, FileText, X, GripVertical } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid' 

interface Props {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function QuestionForm({ initialData, onSave, onCancel }: Props) {
  // State phân biệt Mode: Group (Bài đọc/nghe) hay Single (Câu lẻ)
  // Nếu initialData có type='group' -> Mode Group. Ngược lại -> Mode Single.
  const isInitialGroup = initialData?.type === 'group';

  // 1. STATE CHO GROUP (BÀI ĐỌC/NGHE)
  const [qGroup, setQGroup] = useState(isInitialGroup ? initialData : {
    id: uuidv4(),
    type: 'group',
    content: '',
    media_url: '',
    score: 0,
    sub_questions: []
  })

  // 2. STATE CHO SINGLE QUESTION (CÂU LẺ)
  // Nếu đang sửa câu lẻ, dùng initialData. Nếu không, dùng default.
  const [qSingle, setQSingle] = useState(!isInitialGroup ? (initialData || {
    id: uuidv4(),
    type: 'multiple_choice',
    content: '',
    difficulty: 'medium',
    score: 1,
    options: ['', '', '', ''],
    correct_answer: '0', // Index string
    explanation: ''
  }) : { // Fallback state
    id: uuidv4(),
    type: 'multiple_choice',
    content: '',
    score: 1,
    options: ['', '', '', ''],
    correct_answer: '0'
  })

  // --- LOGIC CHO GROUP ---
  const addSubQuestion = () => {
    const newSub = {
      id: uuidv4(),
      parent_id: qGroup.id,
      content: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '0',
      score: 1,
      difficulty: 'medium'
    }
    setQGroup({ ...qGroup, sub_questions: [...(qGroup.sub_questions || []), newSub] })
  }

  const updateSubQuestion = (index: number, field: string, value: any) => {
    const newSubs = [...qGroup.sub_questions]
    newSubs[index] = { ...newSubs[index], [field]: value }
    setQGroup({ ...qGroup, sub_questions: newSubs })
  }

  const removeSubQuestion = (index: number) => {
    const newSubs = qGroup.sub_questions.filter((_:any, i:number) => i !== index)
    setQGroup({ ...qGroup, sub_questions: newSubs })
  }

  // --- LOGIC CHO SINGLE ---
  const addOptionSingle = () => setQSingle({...qSingle, options: [...qSingle.options, '']})
  const removeOptionSingle = (idx: number) => {
    const newOpts = qSingle.options.filter((_:any, i:number) => i !== idx)
    setQSingle({...qSingle, options: newOpts})
  }

  // --- RENDER ---
  // Xác định đang ở mode nào dựa trên select box (hoặc initialData)
  // Lưu ý: Ta dùng biến tạm isGroupMode để switch giao diện
  const [mode, setMode] = useState<'single' | 'group'>(isInitialGroup ? 'group' : 'single');

  return (
    <div className="border-2 border-sky-500 rounded-xl p-6 bg-white shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
      
      {/* HEADER & TYPE SELECTION */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="font-bold text-sky-700 text-lg">
           {initialData ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
        </h3>
        <select 
            className="h-9 px-3 border border-sky-200 rounded bg-sky-50 font-bold text-sky-700 outline-none focus:ring-2 ring-sky-200 cursor-pointer"
            value={mode === 'group' ? 'group' : qSingle.type}
            onChange={(e) => {
                const val = e.target.value;
                if(val === 'group') {
                    setMode('group');
                } else {
                    setMode('single');
                    setQSingle({...qSingle, type: val});
                }
            }}
        >
            <optgroup label="Câu hỏi đơn">
                <option value="multiple_choice">Trắc nghiệm đơn</option>
                <option value="essay">Tự luận / Viết lại câu</option>
                <option value="error_id">Tìm lỗi sai</option>
                <option value="reorder">Sắp xếp câu</option>
                <option value="fill_in_blank">Điền từ</option>
            </optgroup>
            <optgroup label="Nhóm câu hỏi">
                <option value="group">Bài Đọc / Bài Nghe (Kèm câu hỏi)</option>
            </optgroup>
        </select>
      </div>

      {/* ================= BODY: GROUP MODE ================= */}
      {mode === 'group' ? (
        <div className="space-y-6">
            {/* Context (Audio/Text) */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Nội dung bài Đọc / Link Audio</label>
                
                <div className="flex gap-2 mb-3">
                    <div className="h-10 w-10 bg-white border rounded flex items-center justify-center text-slate-400"><Mic className="w-5 h-5" /></div>
                    <Input 
                        placeholder="Dán link file Audio (MP3) vào đây..." 
                        value={qGroup.media_url || ''}
                        onChange={(e) => setQGroup({...qGroup, media_url: e.target.value})}
                    />
                </div>

                <div className="min-h-[150px] bg-white rounded border border-slate-200 overflow-hidden">
                     <RichTextEditor 
                        content={qGroup.content} 
                        onChange={(html) => setQGroup({...qGroup, content: html})} 
                     />
                </div>
            </div>

            {/* Sub Questions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Danh sách câu hỏi đi kèm ({qGroup.sub_questions?.length || 0})</label>
                    <Button size="sm" onClick={addSubQuestion} variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50">
                        <Plus className="w-4 h-4 mr-2" /> Thêm câu hỏi con
                    </Button>
                </div>

                {qGroup.sub_questions?.map((sub: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-white relative group">
                        <button onClick={() => removeSubQuestion(idx)} className="absolute right-2 top-2 text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                        
                        <div className="flex gap-2 items-center mb-3">
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">Câu {idx + 1}</span>
                            <select 
                                className="text-xs border rounded px-2 py-1 bg-white outline-none focus:border-sky-500"
                                value={sub.type}
                                onChange={(e) => updateSubQuestion(idx, 'type', e.target.value)}
                            >
                                <option value="multiple_choice">Trắc nghiệm</option>
                                <option value="fill_in_blank">Điền từ</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <Input 
                                placeholder="Nhập câu hỏi..." 
                                value={sub.content} 
                                onChange={(e) => updateSubQuestion(idx, 'content', e.target.value)}
                                className="h-9 text-sm font-medium"
                            />
                        </div>

                        {sub.type === 'multiple_choice' && (
                             <div className="grid grid-cols-2 gap-2">
                                {sub.options?.map((opt: string, oIdx: number) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name={`sub_ans_${idx}`} 
                                            checked={sub.correct_answer === oIdx.toString()}
                                            onChange={() => updateSubQuestion(idx, 'correct_answer', oIdx.toString())}
                                            className="cursor-pointer accent-sky-500"
                                        />
                                        <Input 
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...sub.options];
                                                newOpts[oIdx] = e.target.value;
                                                updateSubQuestion(idx, 'options', newOpts);
                                            }}
                                            placeholder={`Đáp án ${String.fromCharCode(65+oIdx)}`}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                ))}
                             </div>
                        )}
                         {sub.type === 'fill_in_blank' && (
                            <Input 
                                placeholder="Nhập từ cần điền (Đáp án đúng)..."
                                value={sub.correct_answer}
                                onChange={(e) => updateSubQuestion(idx, 'correct_answer', e.target.value)}
                                className="border-green-200 bg-green-50/30 text-green-800 placeholder:text-green-800/50"
                            />
                         )}
                    </div>
                ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onCancel}>Hủy</Button>
                <Button onClick={() => onSave(qGroup)} className="bg-sky-500 hover:bg-sky-600 text-white">Lưu Bài Đọc/Nghe</Button>
            </div>
        </div>
      ) : (
        
        // ================= BODY: SINGLE QUESTION MODE =================
        <div className="space-y-5">
            
            {/* Editor Nội dung câu hỏi */}
            <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nội dung câu hỏi</label>
                <div className="min-h-[120px] border border-slate-200 rounded-lg overflow-hidden">
                    <RichTextEditor 
                        content={qSingle.content} 
                        onChange={(html) => setQSingle({...qSingle, content: html})} 
                    />
                </div>
            </div>

            {/* A. TRẮC NGHIỆM */}
            {qSingle.type === 'multiple_choice' && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 block">Các lựa chọn (Tick chọn đáp án đúng)</label>
                    <div className="grid gap-3">
                        {qSingle.options.map((opt: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 group">
                                <input 
                                    type="radio" 
                                    name="single_correct_ans" 
                                    checked={qSingle.correct_answer === idx.toString()} 
                                    onChange={() => setQSingle({...qSingle, correct_answer: idx.toString()})}
                                    className="w-5 h-5 text-sky-500 cursor-pointer accent-sky-500"
                                />
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <Input 
                                        value={opt} 
                                        onChange={(e) => {
                                            const newOpts = [...qSingle.options];
                                            newOpts[idx] = e.target.value;
                                            setQSingle({...qSingle, options: newOpts})
                                        }}
                                        className="pl-8"
                                        placeholder={`Nhập nội dung đáp án ${String.fromCharCode(65 + idx)}...`} 
                                    />
                                </div>
                                <button onClick={() => removeOptionSingle(idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addOptionSingle} className="text-xs font-bold text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-transparent hover:border-sky-200 w-fit">
                        <Plus className="w-3 h-3" /> Thêm lựa chọn
                    </button>
                </div>
            )}

            {/* B. TỰ LUẬN / VIẾT LẠI CÂU */}
            {(qSingle.type === 'essay' || qSingle.type === 'fill_in_blank') && (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Đáp án mẫu / Gợi ý chấm điểm</label>
                        <Textarea 
                            value={qSingle.explanation || ''} 
                            onChange={(e) => setQSingle({...qSingle, explanation: e.target.value})}
                            placeholder="Nhập đáp án đúng hoặc hướng dẫn chấm điểm chi tiết..."
                            className="bg-slate-50 min-h-[100px]"
                        />
                    </div>
                </div>
            )}

            {/* C. SẮP XẾP CÂU */}
            {qSingle.type === 'reorder' && (
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 block">Các thành phần (Nhập theo thứ tự ĐÚNG)</label>
                    <div className="space-y-2">
                        {qSingle.options.map((opt: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-100">
                                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                                <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}.</span>
                                <Input 
                                    value={opt} 
                                    onChange={(e) => {
                                        const newOpts = [...qSingle.options];
                                        newOpts[idx] = e.target.value;
                                        setQSingle({...qSingle, options: newOpts})
                                    }}
                                    placeholder={`Thành phần thứ ${idx + 1}`}
                                    className="bg-white" 
                                />
                                <button onClick={() => removeOptionSingle(idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addOptionSingle} className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 mt-2">
                        <Plus className="w-3 h-3" /> Thêm thành phần
                    </button>
                 </div>
            )}

            {/* FOOTER COMMON (Điểm & Độ khó) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 mt-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Điểm số:</span>
                        <Input 
                            type="number" 
                            value={qSingle.score} 
                            onChange={(e) => setQSingle({...qSingle, score: Number(e.target.value)})} 
                            className="w-20 h-9 text-center font-bold" 
                        />
                    </div>
                    <select 
                        value={qSingle.difficulty}
                        onChange={(e) => setQSingle({...qSingle, difficulty: e.target.value})}
                        className="h-9 text-xs font-medium border rounded px-3 bg-slate-50 outline-none focus:border-sky-500 cursor-pointer"
                    >
                        <option value="easy">Dễ</option>
                        <option value="medium">Trung bình</option>
                        <option value="hard">Khó</option>
                    </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button variant="ghost" onClick={onCancel} className="text-slate-500 hover:bg-slate-100">Hủy</Button>
                    <Button onClick={() => onSave(qSingle)} className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-200">
                        Lưu Câu Hỏi
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}