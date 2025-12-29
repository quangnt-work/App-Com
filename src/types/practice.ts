// types/practice.ts
import { type LucideIcon } from 'lucide-react'

export type PracticeCategory = 'GRAMMAR' | 'VOCAB' | 'READING' | 'LISTENING';
export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  category: PracticeCategory;
  difficulty: Difficulty;
  duration: number;
  is_premium: boolean; // DB trả về snake_case
  created_at: string;
}

// Cấu hình hiển thị cho từng loại bài tập
export interface CategoryConfig {
  label: string;
  color: string; // Text color
  bgColor: string; // Background color
  badgeColor: string; // Badge color
  icon: LucideIcon;
}