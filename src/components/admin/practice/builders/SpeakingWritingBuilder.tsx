import React from 'react'
import { PracticeQuestion } from '@/types/practice-admin'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud } from 'lucide-react'

interface Props {
  mode: 'speaking' | 'writing';
  questions: PracticeQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>;
}

export function SpeakingWritingBuilder({ mode, questions, setQuestions }: Props) {
  
  // Với Speaking/Writing, ta thường chỉ có 1 Question lớn là Đề bài
  const topic = questions[0] || { id: crypto.randomUUID(), type: 'topic', content: '', media_url: '', order_index: 0 };

  const updateTopic = (field: keyof PracticeQuestion, value: string) => {
      const newTopic = { ...topic, [field]: value };
      setQuestions([newTopic]);
  };

  return (
    <Card>
        <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
                <Label className="text-base font-bold text-slate-800">
                    {mode === 'speaking' ? 'Chủ đề Nói (Topic)' : 'Đề bài Viết (Writing Prompt)'}
                </Label>
                <Textarea 
                    value={topic.content}
                    onChange={(e) => updateTopic('content', e.target.value)}
                    placeholder={mode === 'speaking' 
                        ? "VD: Describe a memorable trip you have taken..." 
                        : "VD: Write an essay (min 250 words) about environmental pollution..."}
                    className="min-h-[150px] text-lg"
                />
            </div>

            <div className="space-y-2">
                <Label>Đính kèm file đề bài (Hình ảnh/PDF)</Label>
                <div className="flex gap-4 items-center">
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex-1 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                        <UploadCloud className="w-8 h-8 mb-2"/>
                        <span className="text-sm">Click để upload file</span>
                        <Input type="file" className="hidden" />
                    </div>
                    {/* URL Input dự phòng */}
                    <div className="flex-1">
                        <Input 
                            value={topic.media_url || ''} 
                            onChange={(e) => updateTopic('media_url', e.target.value)}
                            placeholder="Hoặc dán URL ảnh/file tại đây" 
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}