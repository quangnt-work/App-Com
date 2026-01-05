import React, { useState } from 'react'
import { Question, QuestionType } from '@/types/exam-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Check, X, Plus, Trash2, Edit2, Save, FileAudio, FileText, Layers, Circle } from 'lucide-react'
import { toast } from 'sonner'

// ... (Giữ nguyên interface QuestionFormProps và các imports khác)

interface QuestionFormProps {
  initialData?: Question;
  initialType?: QuestionType;
  onSave: (data: Question) => void;
  onCancel: () => void;
  isSubQuestion?: boolean;
}

export function QuestionForm({ initialData, initialType = 'multiple_choice', onSave, onCancel, isSubQuestion = false }: QuestionFormProps) {
  
  const [q, setQ] = useState<Question>(initialData || {
    id: crypto.randomUUID(),
    content: '',
    type: initialType,
    media_type: 'text',
    difficulty: 'medium',
    score: isSubQuestion ? 0.25 : 1,
    options: ['', '', '', ''], // Mặc định 4 options
    correct_answer: '',
    sub_questions: []
  });

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);

  const updateField = (field: keyof Question, value: any) => setQ(prev => ({ ...prev, [field]: value }));

  // --- LOGIC MỚI: THÊM / XÓA OPTION ---
  const handleAddOption = () => {
    setQ(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const handleRemoveOption = (index: number) => {
    if (q.options.length <= 2) {
      return toast.error("Cần tối thiểu 2 lựa chọn!");
    }
    setQ(prev => {
      const newOpts = prev.options.filter((_, i) => i !== index);
      // Nếu xóa trúng đáp án đúng -> reset correct_answer
      const wasCorrect = prev.options[index] === prev.correct_answer;
      return { 
        ...prev, 
        options: newOpts,
        correct_answer: wasCorrect ? '' : prev.correct_answer
      };
    });
  };
  // -------------------------------------

  const handleSaveSubQuestion = (subQ: Question) => {
    setQ(prev => {
      const currentSubs = prev.sub_questions || [];
      if (editingSubIndex === -1) {
        return { ...prev, sub_questions: [...currentSubs, subQ] };
      } else if (editingSubIndex !== null) {
        const newSubs = [...currentSubs];
        newSubs[editingSubIndex] = subQ;
        return { ...prev, sub_questions: newSubs };
      }
      return prev;
    });
    setSubModalOpen(false);
  };

  const handleSave = () => {
    if (!q.content.trim() && q.media_type === 'text') return toast.error('Nội dung không được để trống');
    if (q.type === 'multiple_choice') {
       if (!q.correct_answer) return toast.error('Chưa chọn đáp án đúng');
       if (q.options.some(o => !o.trim())) return toast.error('Có lựa chọn đang để trống');
    }
    if (q.type === 'group') {
        const totalScore = q.sub_questions?.reduce((acc, curr) => acc + (curr.score || 0), 0) || 0;
        q.score = totalScore;
    }
    onSave(q);
  };

  // --- RENDER FORM CHI TIẾT ---
  const renderDetailForm = () => (
    <div className="space-y-5">
       <div className="space-y-2">
        <Label>Nội dung câu hỏi <span className="text-red-500">*</span></Label>
        <Textarea 
          value={q.content} 
          onChange={(e) => updateField('content', e.target.value)} 
          placeholder="Nhập đề bài..." 
          className="min-h-[100px]"
        />
      </div>

      {/* --- CẬP NHẬT UI TRẮC NGHIỆM --- */}
      {q.type === 'multiple_choice' && (
        <div className="bg-slate-50 p-4 rounded border border-slate-200">
           <Label className="mb-3 block text-slate-700 font-semibold">Các lựa chọn & Đáp án đúng</Label>
           <div className="space-y-3">
             {q.options.map((opt, idx) => (
               <div key={idx} className="flex gap-2 items-center group">
                  {/* Nút chọn đáp án đúng */}
                  <div 
                    onClick={() => updateField('correct_answer', opt)}
                    className={`w-10 h-10 flex shrink-0 items-center justify-center border rounded cursor-pointer transition-all ${q.correct_answer === opt && opt !== '' ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-400 text-slate-400'}`}
                    title="Đặt làm đáp án đúng"
                  >
                    {q.correct_answer === opt && opt !== '' ? <Check className="w-5 h-5"/> : <Circle className="w-4 h-4" />}
                  </div>
                  
                  {/* Input nội dung option */}
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{String.fromCharCode(65+idx)}.</span>
                    <Input 
                        value={opt} 
                        onChange={(e) => {
                            const newOpts = [...q.options]; newOpts[idx] = e.target.value;
                            setQ(prev => ({...prev, options: newOpts}));
                        }} 
                        className="pl-8"
                        placeholder={`Nhập đáp án ${String.fromCharCode(65+idx)}...`} 
                    />
                  </div>

                  {/* Nút xóa option */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={q.options.length <= 2}
                  >
                    <X className="w-4 h-4" />
                  </Button>
               </div>
             ))}
           </div>
           
           <Button variant="outline" size="sm" onClick={handleAddOption} className="mt-4 w-full border-dashed text-sky-600 hover:text-sky-700 hover:bg-sky-50">
             <Plus className="w-4 h-4 mr-2" /> Thêm lựa chọn khác
           </Button>
        </div>
      )}

      {(q.type === 'essay' || q.type === 'fill_in_blank') && (
        <div className="space-y-2">
            <Label>Đáp án gợi ý / Từ khóa</Label>
            <Textarea value={q.correct_answer} onChange={(e) => updateField('correct_answer', e.target.value)} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Điểm số</Label>
            <Input type="number" step={0.25} value={q.score} onChange={(e) => updateField('score', parseFloat(e.target.value))} />
        </div>
        <div className="space-y-2">
            <Label>Độ khó</Label>
            <Select value={q.difficulty} onValueChange={(v: any) => updateField('difficulty', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  );

  // ... (Phần render Group và Main Wrapper giữ nguyên như code cũ, chỉ thay đổi phần SubQuestionWrapper bên dưới)

  // -- Wrapper cho Sub Question --
  // Logic Group Form gọi renderDetailForm() bên trong Modal -> tự động có tính năng thêm/xóa option
  
  if (q.type === 'group' && !isSubQuestion) {
     // ... (Code render Group Form giống bài trước)
     // Chỉ cần đảm bảo SubQuestionWrapper gọi QuestionForm thì tính năng thêm/xóa option sẽ tự có
     return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 space-y-6">
            {/* ... Header Group ... */}
            <div className="flex justify-between items-start border-b pb-4">
                {/* ... */}
                 <div>
                    <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2"><Layers className="w-5 h-5"/> Câu hỏi Nhóm</h3>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>Hủy</Button>
                    <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white"><Save className="w-4 h-4 mr-2"/> Lưu Nhóm</Button>
                </div>
            </div>

             {/* ... Tabs Content ... */}
             <div className="space-y-3">
                <Label className="text-base font-semibold">1. Nội dung bài gốc</Label>
                 <Tabs defaultValue="text" value={q.media_type || 'text'} onValueChange={(v: any) => updateField('media_type', v)}>
                    <TabsList>
                        <TabsTrigger value="text"><FileText className="w-4 h-4 mr-2"/> Bài Đọc</TabsTrigger>
                        <TabsTrigger value="audio"><FileAudio className="w-4 h-4 mr-2"/> Bài Nghe</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="pt-2">
                        <Textarea 
                            value={q.content}
                            onChange={(e) => updateField('content', e.target.value)}
                            className="min-h-[150px] font-serif text-lg leading-relaxed bg-slate-50"
                            placeholder="Nội dung bài đọc..."
                        />
                    </TabsContent>
                    <TabsContent value="audio" className="pt-2">
                        <Input value={q.media_url || ''} onChange={(e) => updateField('media_url', e.target.value)} placeholder="URL Audio..." />
                    </TabsContent>
                </Tabs>
             </div>

             {/* ... Sub Questions List ... */}
             <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-100 p-3 rounded">
                    <Label className="text-base font-semibold">2. Danh sách câu hỏi ({q.sub_questions?.length || 0})</Label>
                    <Button size="sm" onClick={() => { setEditingSubIndex(-1); setSubModalOpen(true); }} className="bg-white text-purple-700 border border-purple-200">
                        <Plus className="w-4 h-4 mr-2"/> Thêm câu con
                    </Button>
                </div>
                <div className="grid gap-2">
                    {q.sub_questions?.map((sub, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                             <div className="flex items-center gap-3">
                                <span className="bg-slate-100 text-xs font-bold px-2 py-1 rounded">#{idx+1}</span>
                                <span className="font-bold text-xs uppercase text-slate-500">{sub.type === 'multiple_choice' ? 'TN' : 'TL'}</span>
                                <span className="text-sm truncate max-w-[300px] font-medium">{sub.content}</span>
                             </div>
                             <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => { setEditingSubIndex(idx); setSubModalOpen(true); }}><Edit2 className="w-4 h-4"/></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => {
                                    const newSubs = q.sub_questions?.filter((_, i) => i !== idx);
                                    setQ({...q, sub_questions: newSubs});
                                }}><Trash2 className="w-4 h-4"/></Button>
                             </div>
                        </div>
                    ))}
                </div>
             </div>

             <Dialog open={subModalOpen} onOpenChange={setSubModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingSubIndex === -1 ? 'Thêm câu hỏi con' : 'Sửa câu hỏi con'}</DialogTitle></DialogHeader>
                    <SubQuestionWrapper 
                        initialData={editingSubIndex === -1 ? undefined : q.sub_questions?.[editingSubIndex!]}
                        onSave={handleSaveSubQuestion}
                        onCancel={() => setSubModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
     )
  }

  return (
    <div className={`space-y-6 ${!isSubQuestion ? 'bg-white p-6 rounded-lg shadow-sm border border-sky-100' : ''}`}>
       {!isSubQuestion && (
         <div className="flex justify-between items-center border-b pb-4 mb-4">
             <h3 className="text-lg font-bold text-slate-800">
                {q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
             </h3>
             <div className="flex gap-2">
                 <Button variant="ghost" onClick={onCancel}>Hủy</Button>
                 <Button onClick={handleSave} className="bg-sky-600 text-white"><Save className="w-4 h-4 mr-2"/> Lưu</Button>
             </div>
         </div>
       )}

       {isSubQuestion && (
         <div className="mb-4">
            <Label>Loại câu hỏi</Label>
            <Select value={q.type} onValueChange={(v: any) => updateField('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="multiple_choice">Trắc nghiệm</SelectItem>
                    <SelectItem value="essay">Tự luận</SelectItem>
                </SelectContent>
            </Select>
         </div>
       )}

       {renderDetailForm()}

       {isSubQuestion && (
         <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onCancel}>Hủy</Button>
            <Button onClick={handleSave} className="bg-blue-600 text-white">Xác nhận</Button>
         </DialogFooter>
       )}
    </div>
  )
}

function SubQuestionWrapper(props: QuestionFormProps) {
    return <QuestionForm key={props.initialData?.id || 'new'} {...props} isSubQuestion={true} />
}