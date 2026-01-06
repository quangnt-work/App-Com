// src/app/(admin)/admin/courses/components/CourseTable.tsx
import { Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Course, CourseStatus } from '@/types/course'; // Import type chuẩn

interface CourseTableProps {
  courses: Course[];
  onDelete: (id: string) => void;
  onView: (course: Course) => void;
  isDeletingId: string | null;
}

// Helper function để lấy style và text dựa trên status
// Giúp code trong JSX gọn hơn và dễ quản lý type
const getStatusConfig = (status: CourseStatus) => {
  switch (status) {
    case 'published':
      return { label: 'Công khai', className: 'bg-green-100 text-green-800' };
    case 'hidden':
      return { label: 'Đang ẩn', className: 'bg-gray-100 text-gray-800' };
    case 'draft':
      return { label: 'Bản nháp', className: 'bg-yellow-100 text-yellow-800' };
    default:
      return { label: 'Không rõ', className: 'bg-gray-100 text-gray-500' };
  }
};

export function CourseTable({ courses, onDelete, onView, isDeletingId }: CourseTableProps) {
  if (courses.length === 0) {
    return <div className="text-center py-12 text-gray-500">Không tìm thấy khóa học nào.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">Tên khóa học</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4">Học viên</th>
            <th className="px-6 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course) => {
            const statusConfig = getStatusConfig(course.status);
            
            return (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{course.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{course.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.student_count ?? 0} học viên
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(course)}
                      className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <Link 
                      href={`/admin/courses/${course.id}`} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button 
                      onClick={() => onDelete(course.id)}
                      disabled={isDeletingId === course.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Xóa khóa học"
                    >
                      {isDeletingId === course.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}