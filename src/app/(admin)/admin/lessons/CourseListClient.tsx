// src/app/(admin)/admin/lessons/LessonListClient.tsx
"use client"


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';


import { useLessonFilter } from '@/hooks/useLessonFilter';
import { LessonFilters } from '../../../../components/admin/lessons/LessonFilters';
import { LessonTable } from '@/components/admin/lessons/LessonTable';
import { deleteLesson } from './actions'; // Giả sử bạn có server action này
import type { Lesson } from '@/types/lesson';


import LessonDetailModal from '@/components/admin/lessons/LessonDetailModal';


interface Props {
  initialData: Lesson[];
}


export default function LessonListClient({ initialData }: Props) {
  const router = useRouter();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
 
  // Sử dụng custom hook để lấy data đã lọc
  const { filteredData, searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useLessonFilter(initialData);


  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
   
    setIsDeletingId(id);
    try {
      const res = await deleteLesson(id);
      if (res.success) {
        toast.success('Đã xóa bài học thành công');
        router.refresh();
      } else {
        toast.error('Không thể xóa bài học');
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
        <LessonFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
       
        <LessonTable
          lessons={filteredData}
          onDelete={handleDelete}
          onView={(lesson) => setSelectedLesson(lesson)}
          isDeletingId={isDeletingId}
        />
       
        <div className="mt-4 text-sm text-gray-500 text-right">
          Hiển thị {filteredData.length} / {initialData.length} bài học
        </div>


        <LessonDetailModal
          lesson={selectedLesson}
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      </div>
    </div>
  );
}