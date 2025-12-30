// src/app/(admin)/admin/courses/CourseListClient.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { useCourseFilter } from '@/hooks/useCourseFilter';
import { CourseFilters } from './components/CourseFilters';
import { CourseTable } from './components/CourseTable';
import { deleteCourse } from './actions'; // Giả sử bạn có server action này
import type { Course } from '@/types/course';

import CourseDetailModal from '@/components/admin/courses/CourseDetailModal'; 

interface Props {
  initialData: Course[];
}

export default function CourseListClient({ initialData }: Props) {
  const router = useRouter();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Sử dụng custom hook để lấy data đã lọc
  const { filteredData, searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useCourseFilter(initialData);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    
    setIsDeletingId(id);
    try {
      const res = await deleteCourse(id);
      if (res.success) {
        toast.success('Đã xóa khóa học thành công');
        router.refresh();
      } else {
        toast.error('Không thể xóa khóa học');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <CourseFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        
        <CourseTable 
          courses={filteredData} 
          onDelete={handleDelete}
          onView={(course) => setSelectedCourse(course)}
          isDeletingId={isDeletingId}
        />
        
        <div className="mt-4 text-sm text-gray-500 text-right">
          Hiển thị {filteredData.length} / {initialData.length} khóa học
        </div>

        <CourseDetailModal 
          course={selectedCourse}
          isOpen={!!selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      </div>
    </div>
  );
}