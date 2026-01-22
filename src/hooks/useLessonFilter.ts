// src/hooks/useLessonFilter.ts
import { useState, useMemo } from 'react';
import type { Lesson, LessonStatus } from '@/types/lesson';

export function useLessonFilter(initialData: Lesson[]) {
  const [searchTerm, setSearchTerm] = useState('');
  // Khởi tạo state với đúng type Union
  const [statusFilter, setStatusFilter] = useState<LessonStatus>('published');

  const filteredData = useMemo(() => {
    return initialData.filter((lesson) => {
      const matchSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // So sánh status chính xác
      const matchStatus = statusFilter === 'published' || lesson.status === statusFilter;
      
      return matchSearch && matchStatus;
    });
  }, [initialData, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredData
  };
}