// src/types/practice-admin.ts

export type PracticeSkill = 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Mixed';
export type PracticeQuestionType = 
  | 'multiple_choice' 
  | 'essay' 
  | 'fill_in_blank' 
  | 'reorder'         // Sắp xếp từ
  | 'rewrite'         // Viết lại câu
  | 'error_correction'// Tìm lỗi sai
  | 'topic';

export interface PracticeSet {
  id: string;
  title: string;
  description: string;
  skill: PracticeSkill;
  level: CEFRLevel;
  thumbnail_url?: string;
  total_questions: number;
  is_published: boolean;
  created_at: string;
  // Các trường thống kê (nếu join bảng user_progress)
  stats?: {
    participants: number;
    avg_score: number;
  };
}

export interface PracticeQuestion {
  id: string;
  practice_set_id?: string;
  content: string;
  media_url?: string; // Audio hoặc File đính kèm
  type: PracticeQuestionType;
  options?: string[]; // Dùng cho trắc nghiệm hoặc các từ cần sắp xếp
  correct_answer?: string;
  explanation?: string;
  order_index: number;
  
  // Dành cho UI: Group questions (Reading/Listening)
  sub_questions?: PracticeQuestion[]; 
}