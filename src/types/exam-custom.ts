// src/types/exam-custom.ts
import { Tables } from "./database-custom";

// Enum loại câu hỏi
export type QuestionType = 'multiple_choice' | 'essay' | 'true_false' | 'fill_blank';

// Định nghĩa cấu trúc 1 câu hỏi (trong JSONb)
export interface QuestionItem {
  id: string;
  type: QuestionType;
  content: string; // Nội dung câu hỏi
  points: number;  // Điểm số
  
  // Dành cho trắc nghiệm
  options?: string[]; 
  correctOptionIndex?: number; 
  
  // Dành cho tự luận/điền từ
  correctAnswerText?: string; 
  
  // Giải thích đáp án (optional)
  explanation?: string;
}

// Type mở rộng cho Exam (bao gồm questions đã parse)
export type ExamWithQuestions = Tables<'exams'> & {
  questions_list: QuestionItem[]; // Map từ cột jsonb 'questions' ra đây
};