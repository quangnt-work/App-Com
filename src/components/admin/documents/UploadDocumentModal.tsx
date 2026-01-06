'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { X, CloudUpload, FileText, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadDocumentModal({ isOpen, onClose, onSuccess }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- STATE ---
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileType, setFileType] = useState('PDF') // Mặc định
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Reset form khi đóng
  const handleClose = () => {
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    setFileType('PDF')
    setIsUploading(false)
    onClose()
  }

  // Xử lý chọn file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate size (ví dụ 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File quá lớn! Vui lòng chọn file dưới 50MB.')
        return
      }
      setSelectedFile(file)
      // Tự động detect loại file nếu chưa chọn
      const ext = file.name.split('.').pop()?.toUpperCase()
      if (['PDF', 'DOCX', 'PPTX', 'XLSX'].includes(ext || '')) {
        setFileType(ext!)
      }
    }
  }

  // Logic Upload
  const handleUpload = async () => {
    if (!title.trim()) return toast.error('Vui lòng nhập tiêu đề tài liệu')
    if (!selectedFile) return toast.error('Vui lòng chọn file đính kèm')

    setIsUploading(true)
    try {
      // 1. Upload File lên Storage
      // Tạo tên file unique để tránh trùng
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `documents/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-materials') // Hoặc bucket bạn dùng lưu tài liệu
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      // 2. Lấy Public URL
      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath)

      // 3. Lưu thông tin vào Database
      // Lưu ý: file_size lưu dạng string như "2.4 MB" theo logic cũ của bạn
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB'

      const { error: dbError } = await supabase.from('documents').insert({
        title: title,
        file_url: urlData.publicUrl,
        file_type: fileType,
        file_size: sizeMB,
        // Mô tả có thể lưu vào cột description nếu DB có (nếu chưa có thì bỏ qua)
        // description: description, 
        // Bỏ qua course_id vì yêu cầu bỏ trường khóa học liên quan
      })

      if (dbError) throw dbError

      toast.success('Tải lên tài liệu thành công!')
      router.refresh() // Refresh lại dữ liệu trang cha
      if (onSuccess) onSuccess()
      handleClose()

    } catch (error: any) {
      console.error(error)
      toast.error('Lỗi: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Tải lên tài liệu mới</h2>
          <Button variant="ghost" size="icon" onClick={handleClose} disabled={isUploading}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Tiêu đề */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">
              Tiêu đề tài liệu <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Ví dụ: Giáo trình ReactJS Cơ bản - Chương 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-50 border-slate-200 focus:bg-white h-11"
            />
          </div>

          {/* 2. Loại tài liệu (Select) */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">
              Loại tài liệu
            </label>
            <div className="relative">
              <select 
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="PDF">Tài liệu PDF (.pdf)</option>
                <option value="DOCX">Word Document (.docx)</option>
                <option value="PPTX">PowerPoint Slide (.pptx)</option>
                <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                <option value="MP4">Video bài giảng (.mp4)</option>
                <option value="OTHER">Khác</option>
              </select>
              {/* Custom arrow icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* 3. Mô tả ngắn */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">
              Mô tả ngắn gọn
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả nội dung chính của tài liệu này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* 4. Upload Area */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">
              Tệp đính kèm <span className="text-red-500">*</span>
            </label>
            
            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 rounded-xl bg-sky-50/30 p-10 text-center hover:bg-sky-50 hover:border-sky-400 transition-all cursor-pointer group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.mp4"
                />
                <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-sky-500 border border-sky-100">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sky-700 text-sm">Nhấn để tải lên <span className="font-normal text-slate-500">hoặc kéo thả vào đây</span></h4>
                <p className="text-xs text-slate-400 mt-2">Hỗ trợ: PDF, DOCX, PPTX, XLSX (Tối đa 50MB)</p>
                <div className="flex justify-center gap-3 mt-4 opacity-50">
                   <FileText className="w-4 h-4 text-slate-400" />
                   {/* Thêm các icon nhỏ minh họa nếu muốn */}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-sky-100 shadow-sm text-sky-600 flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Sẵn sàng tải lên</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Xóa
                </Button>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose} disabled={isUploading} className="text-slate-500 hover:text-slate-900">
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold min-w-[120px] shadow-lg shadow-sky-500/20"
          >
            {isUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tải...</> : <><CloudUpload className="w-4 h-4 mr-2" /> Tải lên</>}
          </Button>
        </div>

      </div>
    </div>
  )
}