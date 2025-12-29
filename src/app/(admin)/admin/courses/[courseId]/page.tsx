// src/app/(admin)/admin/courses/[courseId]/page.tsx
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Clock, Users, BookOpen } from 'lucide-react'
import LessonList from './LessonList'

interface PageProps {
  params: Promise<{ courseId: string }>; // Next.js 15: params là Promise
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params; // Await params
  const supabase = await createClient();

  // 1. Fetch Course Info
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (!course) return notFound();

  // 2. Fetch Lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50">
      
      {/* Navigation */}
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 mb-6 font-medium">
        <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      {/* Course Header Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 h-40 bg-gray-200 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
           {course.thumbnail ? (
             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
           )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
               course.status === 'published' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {course.status === 'published' ? 'Đang công khai' : 'Bản nháp'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{lessons?.length || 0} bài học</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>1,204 học viên</span> {/* Số liệu giả định hoặc cần fetch thêm */}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2">
           <LessonList lessons={lessons || []} courseId={courseId} />
        </div>

        {/* Sidebar Info / Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Cấu hình khóa học</h3>
            <div className="space-y-2">
               <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-sky-600 transition-colors">
                 Chỉnh sửa thông tin chung
               </button>
               <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-sky-600 transition-colors">
                 Cài đặt giá bán & SEO
               </button>
               <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                 Xóa khóa học này
               </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}