// types/document.ts
import { type LucideIcon } from 'lucide-react'

export type FileType = 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'MP4';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  file_type: FileType; // DB snake_case
  file_size: string;
  created_at: string; // Dùng thay uploadDate
  download_url?: string;
}

// Interface cho cấu hình hiển thị (Màu sắc, Icon)
export interface FileConfig {
  icon: LucideIcon;
  color: string; // Text color class
  bgColor: string; // Background color class
  label: string;
}