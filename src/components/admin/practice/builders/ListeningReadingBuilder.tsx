import React, { useState } from 'react'
import { PracticeQuestion } from '@/types/practice-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadCloud, FileAudio, FileText, Plus, Trash2 } from 'lucide-react'

// Reuse component QuestionForm (đã viết ở bài Exam) để thêm câu hỏi con
// Giả sử bạn đã có QuestionForm hỗ trợ isSubQuestion
import { QuestionForm } from '../../exams/QuestionForm' 

interface Props {
  mode: 'listening' | 'reading';
  questions: PracticeQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>;
}

export function ListeningReadingBuilder({ mode, questions, setQuestions }: Props) {
  // Đối với Listening/Reading, ta coi toàn bộ nội dung này là 1 Question lớn (Group)
  // Trong thực tế 1 bài tập có thể có nhiều bài đọc. Ở đây demo 1 bài đọc chính.
  
  const [mainContent, setMainContent] = useState(questions[0]?.content || '');
  const [mediaUrl, setMediaUrl] = useState(questions[0]?.media_url || '');
  const [subQuestions, setSubQuestions] = useState<PracticeQuestion[]>(questions[0]?.sub_questions || []);
  const [isAddingSub, setIsAddingSub] = useState(false);

  // Sync state lên cha mỗi khi thay đổi
  const syncToParent = (newContent: string, newUrl: string, newSubs: PracticeQuestion[]) => {
      setMainContent(newContent);
      setMediaUrl(newUrl);
      setSubQuestions(newSubs);

      // Tạo cấu trúc Group Question
      const groupQuestion: PracticeQuestion = {
          id: questions[0]?.id || crypto.randomUUID(),
          type: 'topic', // Dạng bài nhóm
          content: newContent,
          media_url: newUrl,
          order_index: 0,
          sub_questions: newSubs
      };
      setQuestions([groupQuestion]);
  };

  return (
    <div className="space-y-6">
      {/* 1. UPLOAD MEDIA / INPUT CONTENT */}
      <Card>
        <CardHeader><CardTitle>{mode === 'listening' ? 'File Nghe & Script' : 'Nội dung Bài Đọc'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            
            {/* Tab chọn nhập tay hoặc upload */}
            <Tabs defaultValue="upload" className="w-full">
                <TabsList>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="text">Nhập nội dung</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="pt-4 space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <UploadCloud className="w-10 h-10 text-slate-400 mb-2"/>
                        <p className="text-sm font-medium text-slate-700">
                            {mode === 'listening' ? 'Kéo thả file MP3/Audio vào đây' : 'Kéo thả file PDF/Docx bài đọc'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">hoặc click để chọn file từ máy tính</p>
                        <Input type="file" className="hidden" />
                    </div>
                    
                    {/* Input URL thay thế */}
                    <div>
                        <Label>Hoặc nhập URL file (nếu có)</Label>
                        <Input value={mediaUrl} onChange={(e) => syncToParent(mainContent, e.target.value, subQuestions)} placeholder="https://..." />
                    </div>
                </TabsContent>

                <TabsContent value="text" className="pt-4">
                    <Label>{mode === 'listening' ? 'Audio Script (Lời thoại)' : 'Văn bản bài đọc'}</Label>
                    <Textarea 
                        rows={10} 
                        value={mainContent}
                        onChange={(e) => syncToParent(e.target.value, mediaUrl, subQuestions)}
                        placeholder="Paste nội dung vào đây..."
                        className="mt-2"
                    />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      {/* 2. SUB QUESTIONS LIST */}
      <div className="space-y-4">
         <div className="flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Danh sách câu hỏi đi kèm ({subQuestions.length})</h3>
             <Button onClick={() => setIsAddingSub(true)} className="bg-sky-600 text-white">
                 <Plus className="w-4 h-4 mr-2"/> Thêm câu hỏi
             </Button>
         </div>

         {/* Form thêm câu hỏi (Hiện đè lên hoặc modal) */}
         {isAddingSub && (
             <div className="border border-sky-200 rounded-lg p-4 bg-white shadow-sm">
                 <div className="mb-2 font-bold text-sky-700">Soạn câu hỏi mới</div>
                 <QuestionForm 
                    isSubQuestion={true} // Props từ bài trước
                    onSave={(q: any) => {
                        const newSubs = [...subQuestions, { ...q, id: crypto.randomUUID() }];
                        syncToParent(mainContent, mediaUrl, newSubs);
                        setIsAddingSub(false);
                    }}
                    onCancel={() => setIsAddingSub(false)}
                 />
             </div>
         )}

         {/* Danh sách câu hỏi đã thêm */}
         <div className="grid gap-3">
             {subQuestions.map((q, idx) => (
                 <div key={idx} className="bg-white p-4 rounded border flex justify-between items-start">
                     <div>
                         <div className="font-bold text-sm text-slate-700 mb-1">Câu {idx + 1}: {q.content}</div>
                         <div className="flex gap-2 text-xs">
                             <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium uppercase">{q.type}</span>
                             {q.correct_answer && <span className="text-green-600 font-medium">Đ/A: {q.correct_answer}</span>}
                         </div>
                     </div>
                     <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                         const newSubs = subQuestions.filter((_, i) => i !== idx);
                         syncToParent(mainContent, mediaUrl, newSubs);
                     }}>
                         <Trash2 className="w-4 h-4"/>
                     </Button>
                 </div>
             ))}
         </div>
      </div>
    </div>
  )
}