// src/components/admin/practice/PracticeEditor.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PracticeSet, PracticeQuestion, PracticeSkill } from '@/types/practice-admin'

// Components con
import { PracticeInfoSidebar } from './PracticeInfoSidebar'
import { PracticeContentBuilder } from './PracticeContentBuilder'

export default function PracticeEditor({ isNew = true }: { isNew?: boolean }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // 1. STATE THÔNG TIN CHUNG
  const [info, setInfo] = useState<PracticeSet>({
    title: '',
    description: '',
    skill: 'reading', // Mặc định
    level: 'B1',
    is_published: false
  })

  // 2. STATE NỘI DUNG (Danh sách câu hỏi/bài tập)
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])

  // Handler: Lưu toàn bộ xuống DB
  const handleSave = async () => {
    if (!info.title.trim()) return toast.error("Vui lòng nhập tên bài luyện tập");
    if (questions.length === 0) return toast.warning("Chưa có nội dung bài tập nào");

    setIsSaving(true);
    try {
      // TODO: Call API / Supabase insert here
      // 1. Insert Practice Set -> Get ID
      // 2. Insert Questions (Loop)
      
      console.log("Saving Data:", { info, questions }); // Debug
      
      await new Promise(r => setTimeout(r, 1000)); // Mock delay
      toast.success("Đã lưu bài luyện tập thành công!");
      router.push('/admin/practice');
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu dữ liệu");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500">
            <ArrowLeft className="w-5 h-5"/>
          </Button>
          <div>
             <h1 className="text-xl font-bold text-slate-900">
               {isNew ? 'Tạo bài luyện tập mới' : 'Chỉnh sửa bài luyện tập'}
             </h1>
             <p className="text-xs text-slate-500">Thiết lập nội dung theo kỹ năng</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-sky-600 hover:bg-sky-700 text-white min-w-[140px]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
          Lưu bài tập
        </Button>
      </div>

      {/* BODY GRID */}
      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INFO */}
        <div className="xl:col-span-3 h-fit space-y-6">
          <PracticeInfoSidebar 
             info={info} 
             setInfo={setInfo} 
             // Khi đổi skill -> Reset câu hỏi để tránh conflict data type
             onSkillChange={(skill) => {
                if(skill !== info.skill && confirm("Đổi kỹ năng sẽ xóa nội dung hiện tại. Tiếp tục?")) {
                    setInfo(prev => ({ ...prev, skill }));
                    setQuestions([]); 
                }
             }}
          />
        </div>

        {/* RIGHT COLUMN: DYNAMIC CONTENT BUILDER */}
        <div className="xl:col-span-9">
           <PracticeContentBuilder 
              skill={info.skill}
              questions={questions}
              setQuestions={setQuestions}
           />
        </div>
      </div>
    </div>
  )
}