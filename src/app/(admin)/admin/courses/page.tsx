import React from 'react';
import { Plus } from 'lucide-react';
import CourseListClient from './CourseListClient';
import { Course } from '@/types/course';

// Mock Data chuẩn theo ảnh UI
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Lập trình ReactJS Căn Bản',
    description: 'Học ReactJS từ con số 0, xây dựng ứng dụng thực tế.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    instructor_name: 'Nguyễn Văn A',
    instructor_avatar: 'https://i.pravatar.cc/150?u=1',
    students_count: 1250,
    status: 'published',
  },
  {
    id: '2',
    title: 'Thiết kế UI/UX Chuyên Nghiệp',
    description: 'Làm chủ Figma và tư duy thiết kế sản phẩm số.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    instructor_name: 'Trần Thị B',
    instructor_avatar: 'https://i.pravatar.cc/150?u=2',
    students_count: 890,
    status: 'published',
  },
  {
    id: '3',
    title: 'Python cho Data Science',
    description: 'Phân tích dữ liệu với Pandas, NumPy và Matplotlib.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop',
    instructor_name: 'Lê Văn C',
    instructor_avatar: 'https://i.pravatar.cc/150?u=3',
    students_count: 2100,
    status: 'hidden',
  },
  {
    id: '4',
    title: 'Digital Marketing Toàn Tập',
    description: 'Chiến lược SEO, Google Ads và Facebook Ads hiệu quả.',
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop',
    instructor_name: 'Phạm Thị D',
    instructor_avatar: 'https://i.pravatar.cc/150?u=4',
    students_count: 560,
    status: 'published',
  },
  {
    id: '5',
    title: 'Tiếng Anh Giao Tiếp Văn Phòng',
    description: 'Tự tin giao tiếp trong môi trường công sở quốc tế.',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop',
    instructor_name: 'Hoàng Văn E',
    instructor_avatar: 'https://i.pravatar.cc/150?u=5',
    students_count: 1020,
    status: 'hidden',
  },
];

export default function CoursesPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50 font-sans">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Quản lý khóa học</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Quản Lý Khóa Học</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Quản lý danh sách, nội dung, bài giảng và theo dõi trạng thái các khóa học trên hệ thống.
          </p>
        </div>
        
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Thêm khóa học mới
        </button>
      </div>

      {/* Main Content */}
      <CourseListClient initialData={MOCK_COURSES} />
    </div>
  );
}