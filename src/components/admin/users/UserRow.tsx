'use client';

import React from 'react';
import { User } from '@/types/user';
import { StatusBadge, RoleBadge } from '@/components/ui/UserBadges';
import { UserActions } from './UserActions';

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UserRow({ user, isSelected, onSelect, onDelete }: UserRowProps) {
  return (
    <tr className={`group transition-colors ${isSelected ? 'bg-sky-50/30' : 'hover:bg-gray-50'}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.id)}
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
        {/* Nhúng component Actions vào đây */}
        <UserActions userId={user.id} onDelete={onDelete} />
      </td>
    </tr>
  );
}