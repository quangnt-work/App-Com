// src/types/user-management.ts

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export interface ExamSubmission {
  id: string;
  examTitle: string;
  submittedAt: string;
  score: number;
  totalScore: number;
  duration: string;
  status: string;
}

export interface SkillStat {
  skill: string;
  averageScore: number;
  totalPractices: number;
}