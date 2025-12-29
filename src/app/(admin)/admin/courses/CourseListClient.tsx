'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, FileText, Edit, Trash2, 
  ChevronLeft, ChevronRight, Filter 
} from 'lucide-react';
import { Course } from '@/types/course';
import { CourseStatusBadge } from '@/components/admin/courses/CourseStatusBadge';
import Image from 'next/image';

interface Props {
  initialData: Course[];
}

export default function CourseListClient({ initialData }: Props) {
  const [courses, setCourses] = useState<Course[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');

  // --- Logic Filter ---
  const filteredCourses = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // --- Actions ---
  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa khóa học này?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* 1. Filter Section */}
      <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between">
        
        {/* Search & Select Wrapper */}
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Tìm theo tên khóa học, mã ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Instructor Filter (Mock) */}
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Giảng viên</label>
            <div className="relative">
               <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option>Tất cả giảng viên</option>
                <option>Nguyễn Văn A</option>
                <option>Trần Thị B</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="w-full xl:w-auto">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Trạng thái</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['all', 'published', 'hidden'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  statusFilter === tab 
                    ? 'bg-white text-sky-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab === 'published' ? 'Công khai' : 'Ẩn'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-5">Tên khóa học</th>
              <th className="p-5">Giảng viên</th>
              <th className="p-5 text-center">Học viên</th>
              <th className="p-5">Trạng thái</th>
              <th className="p-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-5 min-w-[300px]">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image 
                        src={course.thumbnail || '/images/placeholder.jpg'} 
                        alt={course.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    {/* Title & Desc */}
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{course.title}</h3>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">{course.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <img 
                      src={course.instructor_avatar} 
                      alt={course.instructor_name} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700">{course.instructor_name}</span>
                  </div>
                </td>
                <td className="p-5 text-center font-semibold text-gray-900">
                  {course.students_count.toLocaleString()}
                </td>
                <td className="p-5">
                  <CourseStatusBadge status={course.status} />
                </td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                     <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Xem chi tiết">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Footer / Pagination */}
      <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <p className="text-sm text-gray-500">
          Hiển thị <span className="font-bold text-gray-900">1-{filteredCourses.length}</span> trên <span className="font-bold text-gray-900">{courses.length}</span> khóa học
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-sky-500 text-white font-medium shadow-sm text-sm">1</button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 text-sm">2</button>
          <span className="px-1 text-gray-400">...</span>
          <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 text-sm">5</button>
          <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}