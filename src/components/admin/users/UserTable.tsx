'use client';

import React from 'react';
import { User } from '@/types/user';
import { UserRow } from './UserRow';

interface UserTableProps {
  users: User[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ 
  users, 
  selectedIds, 
  onSelectAll, 
  onSelectOne, 
  onDelete 
}: UserTableProps) {
  const isAllSelected = users.length > 0 && selectedIds.size === users.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
          <tr>
            <th className="p-4 w-10">
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={isAllSelected}
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
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedIds.has(user.id)}
                onSelect={onSelectOne}
                onDelete={onDelete}
              />
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
  );
}