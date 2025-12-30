// src/app/(admin)/admin/courses/components/CourseFilters.tsx
import { Search } from 'lucide-react';
import type { CourseFilterStatus } from '@/types/course'; // Import type vừa tạo

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: CourseFilterStatus; // Strict type
  onStatusChange: (value: CourseFilterStatus) => void; // Strict type
}

export function CourseFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange 
}: CourseFiltersProps) {
  
  // Hàm xử lý thay đổi select an toàn
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Ép kiểu giá trị từ string sang CourseFilterStatus
    // Vì các thẻ <option> bên dưới đã được hardcode đúng value, việc này là an toàn.
    const value = e.target.value as CourseFilterStatus;
    onStatusChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={handleStatusChange} // Sử dụng handler đã định nghĩa type
        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="published">Đang phát hành</option>
        <option value="hidden">Đang ẩn</option>
        <option value="draft">Bản nháp</option>
      </select>
    </div>
  );
}