import React, { useState } from 'react'
import { PracticeQuestion, PracticeQuestionType } from '@/types/practice-admin'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'

// Import QuestionForm (cần update để hỗ trợ các type mới: reorder, rewrite...)
// Giả sử QuestionForm đã được nâng cấp
import { QuestionForm } from '../../exams/QuestionForm' 

interface Props {
  mode: 'grammar' | 'vocabulary';
  questions: PracticeQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>;
}

export function GrammarVocabBuilder({ mode, questions, setQuestions }: Props) {
  
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<PracticeQuestionType>('multiple_choice');

  const handleAdd = (q: PracticeQuestion) => {
      setQuestions([...questions, { ...q, id: crypto.randomUUID(), type: newType, order_index: questions.length }]);
      setIsAdding(false);
  };

  const removeQuestion = (idx: number) => {
      setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
        
        {/* ADD NEW BAR */}
        <Card className="p-4 bg-slate-50 border-dashed border-2 border-slate-300 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="font-bold text-slate-700 whitespace-nowrap">Thêm câu hỏi dạng:</span>
                <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                    <SelectTrigger className="w-[220px] bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple_choice">Trắc nghiệm (MCQ)</SelectItem>
                        <SelectItem value="fill_in_blank">Điền từ (Fill in blank)</SelectItem>
                        {mode === 'grammar' && <SelectItem value="error_correction">Tìm lỗi sai</SelectItem>}
                        {mode === 'grammar' && <SelectItem value="reorder">Sắp xếp câu</SelectItem>}
                        {mode === 'grammar' && <SelectItem value="rewrite">Viết lại câu</SelectItem>}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={() => setIsAdding(true)} className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white">
                <Plus className="w-4 h-4 mr-2"/> Tạo câu hỏi
            </Button>
        </Card>

        {/* FORM EDITOR (Hiện khi bấm Thêm) */}
        {isAdding && (
            <div className="border-2 border-sky-400 rounded-lg overflow-hidden shadow-lg animate-in fade-in zoom-in-95">
                <div className="bg-sky-50 px-4 py-2 text-sky-800 font-bold border-b border-sky-100">
                    Soạn thảo: {newType.toUpperCase().replace('_', ' ')}
                </div>
                {/* LƯU Ý: Bạn cần update QuestionForm để render UI tương ứng với type 'reorder', 'rewrite'...
                   Ví dụ: 'reorder' thì cần nhập 1 câu đúng, hệ thống tự xáo trộn hoặc nhập các từ rời rạc.
                */}
                <QuestionForm 
                    initialType={newType as any}
                    onSave={handleAdd as any}
                    onCancel={() => setIsAdding(false)}
                />
            </div>
        )}

        {/* QUESTIONS LIST */}
        <div className="space-y-3">
            {questions.map((q, idx) => (
                <div key={idx} className="group bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-sky-300 transition-all flex gap-3">
                    <div className="mt-1 cursor-grab text-slate-300 hover:text-slate-500"><GripVertical className="w-5 h-5"/></div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                             <div className="font-bold text-slate-800">Câu {idx + 1}</div>
                             <div className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">{q.type}</div>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">{q.content}</div>
                        {q.correct_answer && (
                            <div className="text-xs text-green-600 mt-2 bg-green-50 inline-block px-2 py-1 rounded font-medium border border-green-100">
                                Đáp án: {q.correct_answer}
                            </div>
                        )}
                    </div>
                    <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeQuestion(idx)}>
                        <Trash2 className="w-4 h-4"/>
                    </Button>
                </div>
            ))}
            
            {questions.length === 0 && !isAdding && (
                <div className="text-center py-12 text-slate-400 italic">
                    Chưa có câu hỏi nào. Hãy thêm câu hỏi mới ở trên.
                </div>
            )}
        </div>
    </div>
  )
}