// src/hooks/useLessonFilter.ts
import { useState, useMemo } from 'react';
import type { Grammar, GrammarStatus } from '@/types/grammar';


export function useGrammarFilter(initialData: Grammar[]) {
  const [searchTerm, setSearchTerm] = useState('');
  // Khởi tạo state với đúng type Union
  const [statusFilter, setStatusFilter] = useState<GrammarStatus>('published');


  const filteredData = useMemo(() => {
    return initialData.filter((grammar) => {
      const matchSearch = grammar.title.toLowerCase().includes(searchTerm.toLowerCase());
     
      // So sánh status chính xác
      const matchStatus = statusFilter === 'published' || grammar.status === statusFilter;
     
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