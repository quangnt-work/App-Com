// components/lessons/sections/general-info.tsx
import { Info } from 'lucide-react';

interface GeneralInfoProps {
  title: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

export default function GeneralInfo({ title, description, onChange }: GeneralInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-lg text-gray-800">Thông tin chung</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài học</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề..."
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả..."
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}