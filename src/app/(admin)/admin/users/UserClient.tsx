// src/app/(admin)/admin/users/UserClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { User } from '@/types/user'; // Đảm bảo bạn đã có file type này
import { StatusBadge, RoleBadge } from '@/components/ui/UserBadges';
import { deleteUser } from './actions'; // Import action xóa
import { useRouter } from 'next/navigation';
import  Link  from 'next/link'

// Component nhận dữ liệu ban đầu từ Server
export default function UserClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
  const router = useRouter();

  // Đồng bộ lại state khi dữ liệu từ server thay đổi (ví dụ sau khi revalidate)
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // --- Logic Filter & Search ---
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'Tất cả vai trò' || user.role === roleFilter;
    
    return matchSearch && matchRole;
  });

  // --- Handlers ---
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
      // 1. Gọi Server Action
      const result = await deleteUser(id);
      
      if (result.success) {
         // 2. Cập nhật UI ngay lập tức (Optimistic update)
         setUsers(prev => prev.filter(u => u.id !== id));
         alert('Đã xóa thành công!');
      } else {
         alert('Có lỗi xảy ra khi xóa.');
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Filters Bar */}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-4 w-10">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length}
                  className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
              </th>
              <th className="p-4">Họ và tên</th>
              <th className="p-4">Username</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className={`group transition-colors ${selectedIds.has(user.id) ? 'bg-sky-50/30' : 'hover:bg-gray-50'}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                      className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                      />
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/users/${user.id}`} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors" title="Xem chi tiết & Chấm bài">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination UI giữ nguyên như cũ hoặc ẩn nếu chưa làm logic phân trang Server */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500">Hiển thị {filteredUsers.length} kết quả</p>
      </div>
    </div>
  );
}