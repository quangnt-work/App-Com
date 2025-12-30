'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Save, CloudUpload, X, File as FileIcon 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/admin/courses/RichTextEditor'
import { CourseLevel, CourseStatus } from '@/types/course'

// Type tạm cho file đính kèm đang chờ lưu
interface PendingAttachment {
  file: File;
  previewUrl?: string;
  uploading: boolean;
}

export default function CreateCourseForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- FORM STATE ---
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('TIẾNG ANH')
  const [level, setLevel] = useState<CourseLevel>('basic')
  const [status, setStatus] = useState<CourseStatus>('draft')
  
  // State lưu file
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([])

  // --- 1. XỬ LÝ CHỌN ẢNH BÌA (Chưa upload ngay) ---
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailFile(file)
    // Tạo URL preview cục bộ (nhanh, không tốn băng thông)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  // --- 2. XỬ LÝ CHỌN TÀI LIỆU (Chưa upload ngay) ---
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;
    
    setPendingAttachments(prev => [...prev, { file, uploading: false }])
    // Reset input để chọn lại file cùng tên nếu muốn
    e.target.value = ''; 
  }

  // --- 3. SUBMIT: UPLOAD ALL -> INSERT DB ---
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên khóa học')
      return
    }

    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Vui lòng đăng nhập lại')
      setIsSubmitting(false)
      return
    }

    try {
      // A. Upload Thumbnail (Nếu có)
      let thumbnailUrl = null
      if (thumbnailFile) {
        const fileName = `thumb-${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { error: uploadError } = await supabase.storage.from('course-materials').upload(fileName, thumbnailFile)
        if (uploadError) throw new Error('Lỗi upload ảnh: ' + uploadError.message)
        
        const { data } = supabase.storage.from('course-materials').getPublicUrl(fileName)
        thumbnailUrl = data.publicUrl
      }

      // B. Tạo Course trong DB
      const { data: newCourse, error: insertError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          category,
          level,
          status,
          thumbnail: thumbnailUrl,
          instructor_id: user.id,
          rating: 5.0,
          duration: '0 phút'
        })
        .select('id')
        .single()

      if (insertError) throw new Error(insertError.message)

      // C. Upload & Insert Attachments (Nếu có)
      if (pendingAttachments.length > 0) {
        // Upload song song tất cả file
        await Promise.all(pendingAttachments.map(async (att) => {
           const fileName = `doc-${Date.now()}-${att.file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
           const { error: upErr } = await supabase.storage.from('course-materials').upload(fileName, att.file)
           if (upErr) return null // Skip file lỗi

           const { data: urlData } = supabase.storage.from('course-materials').getPublicUrl(fileName)
           
           // Insert vào bảng attachment
           await supabase.from('course_attachments').insert({
             course_id: newCourse.id,
             file_name: att.file.name,
             file_url: urlData.publicUrl,
             file_type: att.file.name.split('.').pop() || 'file',
             file_size: (att.file.size / 1024 / 1024).toFixed(2) + ' MB'
           })
        }))
      }

      toast.success('Tạo khóa học thành công!')
      router.push('/admin/courses') // Quay về danh sách hoặc sang trang Edit

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER & LEFT COL (Giống code cũ, lược bớt cho ngắn gọn) */}
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold">Tạo khóa học mới</h1>
         <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>Hủy</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600">
               {isSubmitting ? 'Đang xử lý...' : <><Save className="w-4 h-4 mr-2" /> Hoàn tất</>}
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* CỘT TRÁI: FORM NHẬP LIỆU */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="font-bold text-sky-500">Thông tin cơ bản</h3>
               <Input placeholder="Tên khóa học" value={title} onChange={e => setTitle(e.target.value)} />
               <div className="border rounded-lg overflow-hidden min-h-[200px]">
                  <RichTextEditor content={description} onChange={setDescription} />
               </div>
               {/* Select Category ... */}
            </div>

            {/* UPLOAD TÀI LIỆU (Ngay tại trang tạo mới) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-3">Tài liệu đính kèm</h3>
               <div className="space-y-3 mb-4">
                  {pendingAttachments.map((att, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">
                        <span className="text-sm truncate max-w-[200px]">{att.file.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== idx))}>
                           <X className="w-4 h-4 text-red-500" />
                        </Button>
                     </div>
                  ))}
               </div>
               <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50">
                  <input type="file" multiple onChange={handleAttachmentSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-sm text-slate-500">+ Thêm tài liệu (Upload khi bấm Lưu)</p>
               </div>
            </div>
         </div>

         {/* CỘT PHẢI: ẢNH & SETTING */}
         <div className="space-y-6">
            {/* Ảnh đại diện */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold mb-4">Ảnh bìa</h3>
               <div className="relative border-2 border-dashed rounded-xl p-2 min-h-[150px] flex items-center justify-center">
                  <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {thumbnailPreview ? (
                     <Image src={thumbnailPreview} alt="Preview" width={300} height={200} className="rounded-lg object-cover w-full h-full" />
                  ) : (
                     <div className="text-center text-slate-400">
                        <CloudUpload className="w-8 h-8 mx-auto" />
                        <span className="text-xs">Chọn ảnh</span>
                     </div>
                  )}
               </div>
            </div>
            {/* Status & Level Select ... */}
         </div>
      </div>
    </div>
  )
}