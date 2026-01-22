// src/app/(admin)/admin/courses/[courseId]/LessonList.tsx
'use client'

import React, { useState } from 'react'
import { Lesson } from '@/types/lesson'
import { 
  PlayCircle, FileText, HelpCircle, MoreVertical, 
  Edit, Trash2, GripVertical, Plus 
} from 'lucide-react'
import { deleteLesson } from './actions'

export default function LessonList({ lessons, courseId }: { lessons: Lesson[], courseId: string }) {
  
  const handleDelete = async (id: string) => {
    if(confirm('Bạn có chắc muốn xóa bài học này?')) {
      await deleteLesson(id, courseId);
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'quiz': return <HelpCircle className="w-5 h-5 text-purple-500" />;
      case 'document': return <FileText className="w-5 h-5 text-orange-500" />;
      default: return <PlayCircle className="w-5 h-5 text-sky-500" />;
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800">Danh sách bài học ({lessons.length})</h3>
        <button className="text-sm bg-sky-600 text-white px-3 py-1.5 rounded-md hover:bg-sky-700 flex items-center gap-1 font-medium">
          <Plus className="w-4 h-4" /> Thêm bài mới
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {lessons.length > 0 ? lessons.map((lesson) => (
          <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 group transition-colors">
            
            {/* Drag Handle (UI only) */}
            <div className="text-gray-300 cursor-move">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Icon Type */}
            <div className="p-2 rounded-lg bg-gray-100">
              {getIcon(lesson.type)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 truncate">{lesson.title}</h4>
                {!lesson.is_published && (
                   <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">Draft</span>
                )}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                <span>Thời lượng: {lesson.duration} phút</span>
                <span>•</span>
                <span className="capitalize">{lesson.type}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded" title="Chỉnh sửa">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(lesson.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            Chưa có bài học nào. Hãy thêm bài học đầu tiên!
          </div>
        )}
      </div>
    </div>
  )
}