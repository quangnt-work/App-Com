'use client';

import React from 'react';
import { User } from '@/types/user';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { UserTable } from '@/components/admin/users/UserTable';

export default function UserClient({ initialUsers }: { initialUsers: User[] }) {
  // Lấy toàn bộ logic từ Custom Hook (đã tạo ở bước trước)
  const {
    users: filteredUsers,
    searchTerm,
    roleFilter,
    selectedIds,
    setSearchTerm,
    setRoleFilter,
    handleDelete,
    handleSelectAll,
    handleSelectOne
  } = useUserManagement(initialUsers);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 1. Phần Filters */}
      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* 2. Phần Bảng dữ liệu */}
      <UserTable 
        users={filteredUsers}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onDelete={handleDelete}
      />

      {/* 3. Phần Footer (Pagination đơn giản) */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <p className="text-sm text-gray-500">Hiển thị {filteredUsers.length} kết quả</p>
      </div>
    </div>
  );
}