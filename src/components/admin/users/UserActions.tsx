'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface UserActionsProps {
  userId: string;
  onDelete: (id: string) => void;
}

export function UserActions({ userId, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/admin/users/${userId}`} 
        className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors" 
        title="Xem chi tiết & Chấm bài"
      >
        <Eye className="w-4 h-4" />
      </Link>
      
      <button 
        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" 
        title="Sửa thông tin"
      >
        <Edit className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => onDelete(userId)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
        title="Xóa người dùng"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}