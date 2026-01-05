import React from 'react'
import { ExamData, ExamLevel, ExamStatus } from '@/types/exam-editor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Settings, Clock, BarChart, FileText, Globe } from 'lucide-react'

interface ExamInfoSidebarProps {
  exam: ExamData;
  setExam: (exam: ExamData) => void;
}

export function ExamInfoSidebar({ exam, setExam }: ExamInfoSidebarProps) {
  
  const handleChange = (field: keyof ExamData, value: string | number) => {
    setExam({ ...exam, [field]: value });
  };

  // Helper đổi màu badge trạng thái
  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50 border-green-200';
      case 'hidden': return 'text-slate-500 bg-slate-100 border-slate-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 h-fit sticky top-24">
      <CardHeader className="pb-3 border-b bg-slate-50/50">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
          <Settings className="w-4 h-4 text-sky-500" />
          Thiết lập chung
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-5 pt-5">
        
        {/* 1. TÊN ĐỀ THI (Quan trọng nhất) */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5"/> Tên đề thi <span className="text-red-500">*</span>
          </Label>
          <Input 
            value={exam.title} 
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="VD: Kiểm tra 15 phút Đại số..."
            className="font-medium bg-white"
          />
        </div>

        {/* 2. TRẠNG THÁI (Quyết định hiển thị) */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5"/> Trạng thái phát hành
          </Label>
          <Select 
            value={exam.status} 
            onValueChange={(val) => handleChange('status', val as ExamStatus)}
          >
            <SelectTrigger className={`font-medium border ${getStatusColor(exam.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">📝 Bản nháp (Draft)</SelectItem>
              <SelectItem value="published">✅ Công khai (Published)</SelectItem>
              <SelectItem value="hidden">🔒 Đang ẩn (Hidden)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-500 italic ml-1">
            * Chỉ đề thi "Công khai" mới hiển thị cho học sinh.
          </p>
        </div>

        <div className="border-t border-dashed border-slate-200 my-2"></div>

        {/* 3. THỜI GIAN & ĐỘ KHÓ (Thông số kỹ thuật) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-slate-600 text-xs uppercase font-bold">
                <Clock className="w-3.5 h-3.5"/> Thời gian
            </Label>
            <div className="relative">
                <Input 
                type="number" 
                min={0}
                value={exam.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                className="pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">Phút</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-slate-600 text-xs uppercase font-bold">
                <BarChart className="w-3.5 h-3.5"/> Độ khó
            </Label>
            <Select 
              value={exam.level} 
              onValueChange={(val) => handleChange('level', val as ExamLevel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Dễ</SelectItem>
                <SelectItem value="medium">🟡 Trung bình</SelectItem>
                <SelectItem value="hard">🔴 Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 4. MÔ TẢ */}
        <div className="space-y-2">
          <Label className="text-slate-600 text-xs uppercase font-bold">Hướng dẫn / Ghi chú</Label>
          <Textarea 
            rows={5}
            value={exam.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Nhập hướng dẫn làm bài cho học sinh..."
            className="resize-none bg-slate-50 focus:bg-white transition-colors text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}