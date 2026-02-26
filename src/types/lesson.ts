// src/types/lesson.ts

// 1. Định nghĩa các hằng số phân loại (Enums)
export type LessonType = 'text' | 'video' | 'audio' | 'file' | 'quiz' | 'TEXT' | 'VIDEO' | 'AUDIO';
export type LessonStatus = 'draft' | 'published' | 'archived';

// 2. Interface chính sử dụng cho toàn bộ dự án
export interface Lesson {
  id: string;
  title: string;
  
  // Các trường nội dung (Có thể null từ Database hoặc undefined từ Form)
  slug?: string | null;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  
  // Các URL đính kèm
  file_url?: string | null;
  audio_url?: string | null;
  file_mime_type?: string | null;
  file_size?: number | null;
  
  // Kiểu dữ liệu linh hoạt để chống lỗi xung đột
  type?: LessonType | string | null; 
  // Status trên DB là string, nhưng Form/Zod lại dùng boolean, nên ta cho phép cả hai
  status?: LessonStatus | string | boolean | null; 
  
  // Thời gian
  created_at?: string | null;
  updated_at?: string | null;

  // === GIAO DIỆN STUDENT ===
  duration?: string | null; 
  lessons_count?: number | null;
  rating?: number | null;
  instructor_avatar?: string | null;
  instructor_name?: string | null;
}