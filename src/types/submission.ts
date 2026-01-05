// src/types/submission.ts
export type SubmissionStatus = 'completed' | 'pending' | 'failed';

export interface Submission {
  id: string;
  examTitle: string;
  submittedAt: string; // ISO date string
  score: number;
  totalScore: number;
  duration: string; // ví dụ: "45 phút"
  status: SubmissionStatus;
}