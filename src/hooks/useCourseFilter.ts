// src/hooks/useCourseFilter.ts
import { useState, useMemo } from 'react';
import type { Course, CourseFilterStatus } from '@/types/course';

export function useCourseFilter(initialData: Course[]) {
  const [searchTerm, setSearchTerm] = useState('');
  // Khởi tạo state với đúng type Union
  const [statusFilter, setStatusFilter] = useState<CourseFilterStatus>('all');

  const filteredData = useMemo(() => {
    return initialData.filter((course) => {
      const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // So sánh status chính xác
      const matchStatus = statusFilter === 'all' || course.status === statusFilter;
      
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