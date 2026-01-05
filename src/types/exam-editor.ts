// src/types/exam-editor.ts

export type QuestionType = 
  | 'multiple_choice' 
  | 'essay' 
  | 'group' 
  | 'reorder' 
  | 'error_id' 
  | 'fill_in_blank';

export type ExamLevel = 'easy' | 'medium' | 'hard';
export type ExamStatus = 'draft' | 'published' | 'hidden';
export type MediaType = 'text' | 'audio' | 'image' | null;
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface ExamData {
  id?: string;
  title: string;
  subject: string;
  level: ExamLevel;
  duration: number;
  status: ExamStatus;
  description: string;
  total_score: number;
  code: string;
  question_count?: number;
}

export interface Question {
  id: string; // UUID
  exam_id?: string;
  parent_id?: string | null;
  content: string;
  type: QuestionType;
  difficulty: ExamLevel;
  score: number;
  options: string[];
  correct_answer: string;
  explanation?: string;
  media_type?: MediaType;
  media_url?: string;
  order_index: number;
  // Dành cho UI (Nested Questions)
  sub_questions?: Question[]; 
  section?: string;
  cefr_level?: CEFRLevel;
}