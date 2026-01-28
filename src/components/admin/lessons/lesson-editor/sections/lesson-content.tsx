// components/lessons/sections/lesson-content.tsx
import { FileText, Upload, File as FileIcon, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils'; // Utility class helper

interface LessonContentProps {
  contentType: 'file' | 'text';
  fileUrl: string | null;
  onChange: (field: string, value: any) => void;
}

export default function LessonContent({ contentType, fileUrl, onChange }: LessonContentProps) {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Xử lý upload lên Supabase Storage tại đây
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload success
      onChange('content_url', URL.createObjectURL(file)); 
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg text-gray-800">Nội dung bài học</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Chọn tải lên tài liệu có sẵn hoặc soạn thảo nội dung trực tiếp.</p>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => onChange('content_type', 'file')}
            className={cn(
              "pb-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
              contentType === 'file' ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <Upload className="w-4 h-4" /> Tài liệu tải lên (PDF, DOCX)
          </button>
          <button
            onClick={() => onChange('content_type', 'text')}
            className={cn(
              "pb-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
              contentType === 'text' ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <FileText className="w-4 h-4" /> Soạn thảo văn bản
          </button>
        </div>

        {/* Content Area */}
        {contentType === 'file' ? (
          <div className="space-y-4">
            {/* Upload Zone */}
            {!fileUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".pdf,.docx,.pptx" />
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                   <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-700">Tải lên bài giảng chính</h4>
                <p className="text-xs text-gray-500 mt-1">Hỗ trợ PDF, DOCX, PowerPoint. Tối đa 50MB.</p>
                <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium shadow-sm">Chọn tập tin</button>
              </div>
            ) : (
              // File đã chọn (như trong ảnh)
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded shadow-sm">
                    <FileIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Giao_trinh_Unit5_Travel.pdf</p>
                    <p className="text-xs text-gray-500">2.4 MB • Đã tải lên hoàn tất</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-gray-500 hover:text-blue-600"><Eye className="w-4 h-4"/></button>
                   <button onClick={() => onChange('content_url', null)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            )}
            
            {/* Preview Placeholder */}
            <div className="bg-gray-100 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400">
               <Eye className="w-8 h-8 mb-2" />
               <span className="text-sm">Xem trước nội dung tài liệu sẽ hiển thị tại đây</span>
            </div>
          </div>
        ) : (
          <div className="h-64 border rounded-lg p-4">Rich Text Editor Component Here...</div>
        )}
      </div>
    </div>
  );
}