import React from 'react'
import { PracticeSet, PracticeSkill, CEFRLevel } from '@/types/practice-admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { BookOpen, Headphones, Mic, PenTool, Sparkles, Languages } from 'lucide-react'

interface Props {
  info: PracticeSet;
  setInfo: React.Dispatch<React.SetStateAction<PracticeSet>>;
  onSkillChange: (skill: PracticeSkill) => void;
}

export function PracticeInfoSidebar({ info, setInfo, onSkillChange }: Props) {
  
  const skills: {id: PracticeSkill, label: string, icon: any}[] = [
    { id: 'listening', label: 'Nghe (Listening)', icon: Headphones },
    { id: 'speaking', label: 'Nói (Speaking)', icon: Mic },
    { id: 'reading', label: 'Đọc (Reading)', icon: BookOpen },
    { id: 'writing', label: 'Viết (Writing)', icon: PenTool },
    { id: 'grammar', label: 'Ngữ pháp (Grammar)', icon: Sparkles },
    { id: 'vocabulary', label: 'Từ vựng (Vocabulary)', icon: Languages },
  ];

  return (
    <Card className="border-slate-200 shadow-sm sticky top-24">
      <CardHeader className="bg-slate-50/50 border-b pb-3">
        <CardTitle className="text-base font-bold text-slate-800">Thông tin chung</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        
        {/* 1. Tên bài tập */}
        <div className="space-y-2">
          <Label>Tên bài luyện tập <span className="text-red-500">*</span></Label>
          <Input 
            value={info.title} 
            onChange={(e) => setInfo({ ...info, title: e.target.value })}
            placeholder="VD: Luyện nghe chủ đề Travel..." 
          />
        </div>

        {/* 2. Chọn Kỹ năng */}
        <div className="space-y-2">
          <Label>Kỹ năng <span className="text-red-500">*</span></Label>
          <Select value={info.skill} onValueChange={(v) => onSkillChange(v as PracticeSkill)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {skills.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <s.icon className="w-4 h-4 text-slate-500"/> {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-500 italic">
             Giao diện nhập liệu sẽ thay đổi theo kỹ năng bạn chọn.
          </p>
        </div>

        {/* 3. Trình độ */}
        <div className="space-y-2">
           <Label>Trình độ</Label>
           <Select value={info.level} onValueChange={(v) => setInfo({ ...info, level: v as CEFRLevel })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
               {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
                   <SelectItem key={l} value={l}>{l}</SelectItem>
               ))}
            </SelectContent>
           </Select>
        </div>

        {/* 4. Mô tả */}
        <div className="space-y-2">
            <Label>Mô tả ngắn</Label>
            <Textarea 
                value={info.description} 
                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                rows={3} 
            />
        </div>

        {/* 5. Publish */}
        <div className="flex items-center justify-between border-t pt-4">
            <Label className="cursor-pointer" htmlFor="publish">Công khai bài tập?</Label>
            <Switch 
                id="publish"
                checked={info.is_published}
                onCheckedChange={(checked) => setInfo({ ...info, is_published: checked })}
            />
        </div>

      </CardContent>
    </Card>
  )
}