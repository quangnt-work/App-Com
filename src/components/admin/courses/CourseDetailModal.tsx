'use client'

import React from 'react'
import { X, FileText, Video, Calendar, User, Clock } from 'lucide-react'
import Image from 'next/image'
import { Course } from '@/types/course'
import { Button } from '@/components/ui/button'

interface Props {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseDetailModal({ course, isOpen, onClose }: Props) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{course.category}</span>
              <span>•</span>
              <span className="capitalize">{course.level}</span>
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {/* Banner Image */}
          <div className="relative w-full h-64 bg-gray-100">
            {course.thumbnail ? (
               <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
            ) : (
               <div className="flex items-center justify-center h-full text-gray-400">Không có ảnh bìa</div>
            )}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium">{course.instructor_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium">{new Date(course.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Left: Description */}
             <div className="md:col-span-2 space-y-6">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-3">Mô tả khóa học</h3>
                   <div 
                     className="prose prose-sm max-w-none text-gray-600"
                     dangerouslySetInnerHTML={{ __html: course.description || '<p>Chưa có mô tả</p>' }} 
                   />
                </div>
             </div>

             {/* Right: Stats & Attachments (Giả lập hiển thị) */}
             <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-3 text-sm">Thông tin khác</h3>
                   <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                         <span className="text-gray-500">Bài học:</span>
                         <span className="font-medium">{course.lessons_count} bài</span>
                      </li>
                      <li className="flex justify-between">
                         <span className="text-gray-500">Học viên:</span>
                         <span className="font-medium">{course.students_count}</span>
                      </li>
                      <li className="flex justify-between">
                         <span className="text-gray-500">Đánh giá:</span>
                         <span className="font-medium text-amber-500">{course.rating} ★</span>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={() => window.location.href = `/admin/courses/${course.id}`}>
             Chỉnh sửa ngay
          </Button>
        </div>
      </div>
    </div>
  )
}