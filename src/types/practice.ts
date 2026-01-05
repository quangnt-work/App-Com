// src/types/practice.ts

export type PracticeSkill = 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Mixed';

export interface PracticeSet {
  id: string;
  title: string;
  description: string;
  skill: PracticeSkill;
  level: CEFRLevel;
  thumbnail_url?: string;
  total_questions: number;
  is_published: boolean;
  
  // Trường join từ bảng progress (nếu có)
  progress?: {
    completed_questions: number;
    status: 'in_progress' | 'completed';
    score: number;
  } | null;
}