'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
}

export function UserFilters({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter 
}: UserFiltersProps) {
  return (
    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Role Select */}
        <div className="relative hidden md:block">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option>Tất cả vai trò</option>
            <option>Học viên</option>
            <option>Quản trị viên</option>
          </select>
          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}