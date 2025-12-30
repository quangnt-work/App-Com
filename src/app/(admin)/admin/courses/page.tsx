import React from 'react';
import { Plus, Inbox } from 'lucide-react';
import Link from 'next/link';
import CourseListClient from './CourseListClient';
import { createClient } from '@/lib/supabase/server';
import { Course, CourseStatus, CourseLevel } from '@/types/course';

// 1. Định nghĩa kiểu dữ liệu thô trả về từ Supabase (để không dùng any)
interface SupabaseCourseResponse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  status: string | null;
  rating: number | null;
  created_at: string;
  instructor_id: string | null;
  // Quan hệ profiles (One-to-One hoặc Many-to-One) -> Trả về Object hoặc null
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  // Quan hệ lessons (One-to-Many) -> Trả về mảng Object
  lessons: {
    count: number;
  }[];
}

export default async function CoursesPage() {
  const supabase = await createClient();

  // 2. Query Data với Select cụ thể
  const { data: rawData, error } = await supabase
    .from('courses')
    .select(`
      id, title, description, thumbnail, category, level, duration, status, rating, created_at, instructor_id,
      profiles:instructor_id(full_name, avatar_url),
      lessons:lessons(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu: {error.message}</div>;
  }

  // 3. Ép kiểu an toàn từ Supabase Response sang Type Raw đã định nghĩa
  const coursesData = rawData as unknown as SupabaseCourseResponse[];

  // 4. Map sang Interface Course chuẩn của ứng dụng
  const formattedCourses: Course[] = coursesData.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    thumbnail: item.thumbnail,
    category: item.category || 'KHÁC',
    level: (item.level as CourseLevel) || 'basic', // Ép kiểu an toàn cho Level
    duration: item.duration || '0 phút',
    status: (item.status as CourseStatus) || 'draft', // Ép kiểu an toàn cho Status
    rating: item.rating || 5.0,
    created_at: item.created_at,
    
    // Xử lý dữ liệu lồng nhau an toàn
    lessons_count: item.lessons?.[0]?.count || 0,
    students_count: 0, // Tạm thời hardcode
    instructor_name: item.profiles?.full_name || 'Admin',
    instructor_avatar: item.profiles?.avatar_url || null,
    instructor_id: item.instructor_id || undefined
  }));

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
            Quản lý danh sách, nội dung, bài giảng và theo dõi trạng thái các khóa học.
          </p>
        </div>

        <Link href="/admin/courses/new" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Main Content */}
      {formattedCourses.length > 0 ? (
        <CourseListClient initialData={formattedCourses} />
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Chưa có khóa học nào</h3>
          <p className="text-gray-500 mb-6">Hãy tạo khóa học đầu tiên để bắt đầu giảng dạy.</p>
          <Link href="/admin/courses/new" className="text-sky-600 font-bold hover:underline">
            + Tạo ngay
          </Link>
        </div>
      )}
    </div>
  );
}