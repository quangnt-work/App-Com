'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Save, Upload, CloudUpload, File as FileIcon, X, 
  GripVertical, Plus, Video, FileText, Trash2
} from 'lucide-react'
import { Course, CourseAttachment, CourseLevel } from '@/types/course'
import { Lesson } from '@/types/lesson' // Import type Lesson
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/admin/courses/RichTextEditor'

interface Props {
  course: Course;
}

export default function CourseEditForm({ course: initialData }: Props) {
  const [course, setCourse] = useState<Course>(initialData)
  const [lessons, setLessons] = useState<Lesson[]>(initialData.lessons || [])
  const [attachments, setAttachments] = useState<CourseAttachment[]>(initialData.attachments || [])
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  // --- 1. XỬ LÝ UPLOAD ẢNH BÌA ---
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileName = `thumb-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    const { error } = await supabase.storage.from('course-materials').upload(fileName, file)

    if (error) {
      toast.error('Lỗi upload: ' + error.message)
      return
    }

    const { data } = supabase.storage.from('course-materials').getPublicUrl(fileName)
    setCourse(prev => ({ ...prev, thumbnail: data.publicUrl }))
    toast.success('Đã cập nhật ảnh bìa')
  }

  // --- 2. XỬ LÝ UPLOAD TÀI LIỆU ---
  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const fileName = `doc-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    
    const { error: uploadError } = await supabase.storage.from('course-materials').upload(fileName, file)
    if (uploadError) {
      toast.error('Lỗi upload file')
      setIsLoading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('course-materials').getPublicUrl(fileName)

    const newDoc = {
      course_id: course.id,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.name.split('.').pop() || 'file',
      file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }

    const { data: savedDoc, error: dbError } = await supabase
      .from('course_attachments')
      .insert(newDoc)
      .select()
      .single()

    if (!dbError && savedDoc) {
      // Ép kiểu an toàn vì Supabase trả về generic object
      setAttachments(prev => [...prev, savedDoc as CourseAttachment])
      toast.success('Đã thêm tài liệu')
    }
    setIsLoading(false)
  }

  // --- 3. LƯU THÔNG TIN KHÓA HỌC ---
  const handleSave = async () => {
    setIsLoading(true)
    const { error } = await supabase
      .from('courses')
      .update({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        status: course.status,
        thumbnail: course.thumbnail
      })
      .eq('id', course.id)

    if (error) toast.error(error.message)
    else {
      toast.success('Lưu thành công!')
      router.refresh()
    }
    setIsLoading(false)
  }

  // --- 4. XÓA BÀI HỌC (Optimistic UI) ---
  const handleDeleteLesson = async (lessonId: string) => {
    if(!confirm("Bạn có chắc muốn xóa bài học này?")) return;

    // Cập nhật UI ngay lập tức
    const oldLessons = [...lessons];
    setLessons(prev => prev.filter(l => l.id !== lessonId));

    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
    
    if (error) {
        toast.error("Lỗi khi xóa bài học");
        setLessons(oldLessons); // Hoàn tác nếu lỗi
    } else {
        toast.success("Đã xóa bài học");
        router.refresh();
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chi tiết khóa học</h1>
          <p className="text-slate-500 text-sm">Cập nhật nội dung và bài giảng.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/courses')}>Trở về</Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-sky-500 hover:bg-sky-600">
            {isLoading ? 'Đang lưu...' : <><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === CỘT TRÁI (Nội dung chính) === */}
        <div className="lg:col-span-2 space-y-6">
            {/* THÔNG TIN CHUNG */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-bold text-sky-500 flex items-center gap-2">
                    <span className="bg-sky-100 p-1 rounded-full"><div className="w-2 h-2 bg-sky-500 rounded-full" /></span>
                    Thông tin chung
                </h3>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tên khóa học</label>
                    <Input 
                        value={course.title} 
                        onChange={e => setCourse({...course, title: e.target.value})}
                        className="font-medium text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Mô tả</label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden min-h-[150px]">
                        <RichTextEditor 
                            content={course.description || ''} 
                            onChange={(html) => setCourse({...course, description: html})} 
                        />
                    </div>
                </div>
            </div>

            {/* DANH SÁCH BÀI HỌC (Flat List) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sky-500">Nội dung bài học ({lessons.length})</h3>
                    <Button 
                        onClick={() => router.push(`/admin/courses/${course.id}/lessons/new`)}
                        className="bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Thêm bài học
                    </Button>
                </div>
                
                <div className="space-y-3">
                    {lessons.length > 0 ? lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-white hover:border-sky-300 transition-colors group">
                            <div className="text-slate-300 cursor-move"><GripVertical className="w-5 h-5" /></div>
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{lesson.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    {lesson.type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                    <span>{lesson.duration || 0} phút</span>
                                    {lesson.is_published ? 
                                        <span className="text-emerald-600 bg-emerald-50 px-1.5 rounded">Công khai</span> : 
                                        <span className="text-amber-600 bg-amber-50 px-1.5 rounded">Nháp</span>
                                    }
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                                    onClick={() => router.push(`/admin/courses/${course.id}/lessons/${lesson.id}`)} // Vào trang Edit bài học
                                >
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="ghost" size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-500 text-sm">Chưa có bài học nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* === CỘT PHẢI (Cấu hình & File) === */}
        <div className="space-y-6">
            {/* TRẠNG THÁI & CẤP ĐỘ */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Trạng thái hiển thị</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            className="toggle toggle-primary" // Dùng class của tailwind hoặc component Switch
                            checked={course.status === 'published'}
                            onChange={(e) => setCourse(prev => ({...prev, status: e.target.checked ? 'published' : 'hidden'}))}
                        />
                        <span className="text-sm">{course.status === 'published' ? 'Đang công khai' : 'Đang ẩn'}</span>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Cấp độ</label>
                    <div className="flex gap-2">
                        {(['basic', 'intermediate', 'advanced'] as CourseLevel[]).map((lvl) => (
                            <button 
                                key={lvl}
                                onClick={() => setCourse(prev => ({ ...prev, level: lvl }))}
                                className={`px-3 py-1.5 text-xs font-bold rounded-full border capitalize transition-all ${
                                    course.level === lvl 
                                    ? 'bg-sky-500 text-white border-sky-500' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ẢNH ĐẠI DIỆN */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Ảnh bìa khóa học</h3>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-sky-400 transition-colors relative group">
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {course.thumbnail ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                            <Image src={course.thumbnail} alt="Thumb" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="py-8">
                            <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">Tải ảnh lên</p>
                        </div>
                    )}
                </div>
            </div>

            {/* TÀI LIỆU ĐÍNH KÈM */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Tài liệu đính kèm</h3>
                <div className="space-y-3 mb-4">
                    {attachments.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded text-xs font-bold uppercase">
                                {doc.file_type.slice(0,3)}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.file_name}</p>
                                <p className="text-[10px] text-slate-500">{doc.file_size}</p>
                             </div>
                             <button 
                                onClick={() => setAttachments(prev => prev.filter(p => p.id !== doc.id))} 
                                className="text-slate-400 hover:text-red-500"
                             >
                                <X className="w-4 h-4" />
                             </button>
                        </div>
                    ))}
                </div>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" onChange={handleAttachmentUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <p className="text-xs font-bold text-slate-600">+ Tải tài liệu mới</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}