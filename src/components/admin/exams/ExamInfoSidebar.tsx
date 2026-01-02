'use client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea' // Dùng shadcn textarea
import { Button } from '@/components/ui/button'
import { CloudUpload, Info } from 'lucide-react'

// Mock Data cho Select
const SUBJECTS = ['Toán học', 'Vật lý', 'Tiếng Anh', 'Hóa học']
const LEVELS = ['easy', 'medium', 'hard']

interface Props {
  exam: any;
  setExam: (val: any) => void;
}

export function ExamInfoSidebar({ exam, setExam }: Props) {
  const handleChange = (field: string, value: any) => {
    setExam({ ...exam, [field]: value })
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
      <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
        <div className="p-1.5 bg-sky-100 rounded-lg">
            <Info className="w-5 h-5 text-sky-600" />
        </div>
        Thông tin chung
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1 block">Tên đề thi <span className="text-red-500">*</span></label>
          <Input 
            value={exam.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            placeholder="Ví dụ: Kiểm tra giữa kỳ II - Toán Cao Cấp"
            className="bg-slate-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Môn học</label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm"
              value={exam.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Cấp độ</label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm capitalize"
              value={exam.level}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Thời gian (phút)</label>
            <Input type="number" value={exam.duration} onChange={(e) => handleChange('duration', Number(e.target.value))} className="bg-slate-50" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Tổng điểm</label>
            <Input type="number" value={exam.total_score || 100} readOnly className="bg-slate-100 text-slate-500" />
          </div>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer transition-colors">
            <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Kéo thả hoặc nhấn để tải lên file đề (PDF/DOCX)</p>
        </div>

        <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Mô tả / Ghi chú</label>
            <Textarea 
                value={exam.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Nhập ghi chú cho đề thi..." 
                className="bg-slate-50 min-h-[100px]" 
            />
        </div>

        <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${exam.status === 'published' ? 'text-sky-600' : 'text-slate-500'}`}>
                    {exam.status === 'published' ? 'Công khai' : 'Nháp'}
                </span>
                {/* Custom Toggle Switch Simplification */}
                <button 
                    onClick={() => handleChange('status', exam.status === 'published' ? 'draft' : 'published')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${exam.status === 'published' ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${exam.status === 'published' ? 'left-6' : 'left-1'}`} />
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}