// src/types/document.ts
export interface DocumentItem {
  id: string;
  title: string;
  file_url: string;
  file_type: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'MP4' | 'OTHER';
  file_size: string;
  created_at: string;
  uploader_name: string; // Join từ profiles
  course_name: string;   // Join từ courses
}