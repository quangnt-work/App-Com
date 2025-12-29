// src/components/ui/UserBadges.tsx
import React from 'react';
import { UserRole, UserStatus } from '@/types/user';

export const StatusBadge = ({ status }: { status: UserStatus }) => {
  const styles = status === 'Hoạt động' 
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
    : 'bg-red-100 text-red-700 border-red-200';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles} inline-flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
      {status}
    </span>
  );
};

export const RoleBadge = ({ role }: { role: UserRole }) => {
  const styles = role === 'Quản trị viên'
    ? 'bg-sky-100 text-sky-700 border-sky-200'
    : 'bg-gray-100 text-gray-700 border-gray-200';
    
  return (
    <span className={`px-3 py-1 rounded-md text-xs font-medium border ${styles}`}>
      {role}
    </span>
  );
};