import React from 'react';
import { CourseStatus } from '@/types/course';

export const CourseStatusBadge = ({ status }: { status: CourseStatus }) => {
  const config = {
    published: {
      label: 'Công khai',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500'
    },
    hidden: {
      label: 'Ẩn',
      className: 'bg-gray-100 text-gray-600 border-gray-200',
      dot: 'bg-gray-400'
    },
    draft: {
      label: 'Nháp',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500'
    }
  };

  const style = config[status] || config.hidden;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style.className} inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {style.label}
    </span>
  );
};