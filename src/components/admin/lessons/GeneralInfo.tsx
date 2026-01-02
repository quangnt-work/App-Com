// src/components/admin/lessons/GeneralInfo.tsx
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface Props {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}

export default function GeneralInfo({ title, setTitle, description, setDescription }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
            <Info className="w-3.5 h-3.5 text-sky-600" />
        </div>
        Thông tin chung
      </h3>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tiêu đề bài học</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Hành trang du lịch: Đặt vé & Sân bay"
            className="bg-slate-50 border-slate-200 focus:bg-white h-11 text-sm font-medium"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Mô tả ngắn</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
            placeholder="Học viên sẽ học các từ vựng liên quan đến..."
          />
        </div>
      </div>
    </div>
  );
}