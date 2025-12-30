export type LessonType = 'video' | 'quiz' | 'document';

export interface Lesson {
  id: string;
  course_id: string; // Đã thay thế module_id
  title: string;
  type: LessonType;
  duration: number; // Phút
  is_published: boolean;
  order_index: number;
  created_at: string;
  
  // Nội dung chi tiết
  content: string | null;      // HTML text
  video_url: string | null;    // Youtube/Vimeo URL
  resource_url: string | null; // File PDF/DOCX Upload
}