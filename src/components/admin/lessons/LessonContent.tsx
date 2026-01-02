// src/components/admin/lessons/LessonContent.tsx
'use client'

import React, { useState, useRef } from 'react'
import { CloudUpload, FileText, File as FileIcon, Trash2, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/admin/courses/RichTextEditor' 
import { uploadFileToStorage } from '@/lib/upload'
import Link from 'next/link'

interface Props {
  contentType: 'upload' | 'editor';
  setContentType: (type: 'upload' | 'editor') => void;
  contentHtml: string;
  setContentHtml: (html: string) => void;
  // Props mới cho file upload
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
}

export default function LessonContent({ 
  contentType, setContentType, 
  contentHtml, setContentHtml,
  fileUrl, setFileUrl 
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate loại file
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    // Lưu ý: check type của file docx/pptx đôi khi phức tạp, nên check đuôi file sẽ an toàn hơn nếu cần.

    setIsUploading(true);
    const publicUrl = await uploadFileToStorage(file, 'course_materials', 'documents');
    
    if (publicUrl) {
      setFileUrl(publicUrl);
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header & Tabs giữ nguyên như cũ... */}
      <div className="p-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-500" /> Nội dung bài học
        </h3>
      </div>
      
      <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-2">
        <button onClick={() => setContentType('upload')} className={`pb-3 pt-2 px-4 text-sm font-bold border-b-2 transition-colors ${contentType === 'upload' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500'}`}>
          <CloudUpload className="w-4 h-4 inline mr-2" /> Tài liệu (PDF/DOCX)
        </button>
        <button onClick={() => setContentType('editor')} className={`pb-3 pt-2 px-4 text-sm font-bold border-b-2 transition-colors ${contentType === 'editor' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500'}`}>
          <FileText className="w-4 h-4 inline mr-2" /> Soạn thảo HTML
        </button>
      </div>

      <div className="p-6">
        {contentType === 'upload' ? (
          <div className="space-y-6">
            {/* Nếu chưa có file thì hiện khung upload */}
            {!fileUrl ? (
              <div 
                className="border-2 border-dashed border-sky-100 rounded-xl bg-sky-50/30 p-10 text-center hover:bg-sky-50 cursor-pointer group relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx,.doc,.pptx,.ppt" 
                  onChange={handleFileChange}
                />
                
                {isUploading ? (
                   <div className="flex flex-col items-center">
                     <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
                     <p className="text-sm text-sky-600 font-medium">Đang tải lên...</p>
                   </div>
                ) : (
                  <>
                    <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileIcon className="w-6 h-6 text-sky-500" />
                    </div>
                    <h4 className="font-bold text-slate-800">Nhấn để tải tài liệu lên</h4>
                    <p className="text-xs text-slate-500 mt-1">Hỗ trợ PDF, DOCX, PPTX (Max 50MB)</p>
                  </>
                )}
              </div>
            ) : (
              /* Nếu đã có file thì hiện preview */
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Tài liệu hiện tại</p>
                <div className="flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-sky-200 flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{fileUrl.split('/').pop()}</p>
                      <Link href={fileUrl} target="_blank" className="text-[10px] text-sky-600 hover:underline">
                        Nhấn để xem file gốc
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-500" onClick={() => setFileUrl(null)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[400px]">
            <RichTextEditor content={contentHtml} onChange={setContentHtml} />
          </div>
        )}
      </div>
    </div>
  )
}