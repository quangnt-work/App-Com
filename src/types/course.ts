import { Lesson } from './lesson';

export type CourseStatus = 'published' | 'hidden' | 'draft';
export type CourseLevel = 'basic' | 'intermediate' | 'advanced';
export type CourseFilterStatus = 'all' | CourseStatus;

export interface CourseAttachment {
  id: string;
  course_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail: string | null;
  category: string;
  level: CourseLevel;
  duration: string;
  rating: number;
  status: CourseStatus;
  created_at: string;
  updatedAt: string;

  // Quan hệ trực tiếp
  lessons: Lesson[]; 
  attachments?: CourseAttachment[];
  
  // Các trường đếm/join
  lessons_count?: number;
  students_count?: number;

  instructor_id: string;
  instructor_name?: string;
  instructor_avatar?: string | null;
}