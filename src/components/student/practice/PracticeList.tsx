'use client';

import React, { useState, useMemo } from 'react';
import { PracticeSetWithProgress } from '@/types/practice';
import { PracticeCard } from './PracticeCard';
import { Search, Filter } from 'lucide-react';

export function PracticeList({ initialData }: { initialData: PracticeSetWithProgress[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Chỉ cần lọc theo Search Term (vì Skill đã được lọc từ Server)
  const filteredData = useMemo(() => {
    return initialData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialData, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Toolbar: Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <span className="font-semibold text-gray-700">
            Tìm thấy {filteredData.length} bài tập
        </span>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo tên bài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>
      </div>

      {/* Grid Results */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-300">
          {filteredData.map((item) => (
            <PracticeCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không tìm thấy kết quả nào.</p>
        </div>
      )}
    </div>
  );
}