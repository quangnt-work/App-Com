export type LessonType = 'text' | 'file' | 'video';
export type LessonStatus = 'draft' | 'published' | 'archived';

export interface Lesson {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  thumbnail: string | null;
  type: LessonType;
  
  // Nội dung
  content: string | null; // Cho type 'text'
  file_url: string | null; // Cho type 'file'
  file_mime_type: string | null;
  file_size: number | null;

  // Quản lý
  instructor_id: string | null;
  category: string;
  tags: string[] | null;
  status: LessonStatus;
  
  created_at: string;
  updated_at: string;
}

// Input dùng cho form tạo/sửa
export interface LessonInput {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  type: LessonType;
  content?: string;
  file_url?: string;
  file_mime_type?: string;
  file_size?: number;
  category: string;
  status: boolean; // Mapper từ UI (switch) sang DB ('published'/'draft')
}