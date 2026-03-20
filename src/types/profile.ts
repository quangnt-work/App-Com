// src/types/profile.ts
export type TestCategory = 'Tổng hợp' | 'Đọc hiểu' | 'Ngữ pháp' | 'Nghe hiểu';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  level: string;
  email: string;
  joinDate: string;
  avatarUrl?: string;
}

export interface TestRecord {
  id: string;
  submissionId?: string;
  examId?: string;
  date: string;
  name: string;
  type: TestCategory;
  score: number;
  totalScore: number;
  passed: boolean;
  examLevel?: string;
  examDuration?: number;
}

export interface ChartDataPoint {
  name: string; // T1, T2,... T10
  reading?: number;
  grammar?: number;
  listening?: number;
  mixed?: number;
}

// Types for the exam result modal
export interface ExamResultDetail {
  submissionId: string;
  examId: string;
  examTitle: string;
  examType: TestCategory;
  examLevel: string;
  examDuration: number;
  date: string;
  score: number;
  totalScore: number;
  passed: boolean;
}