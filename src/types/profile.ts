// src/types/profile.ts
export type TestCategory = 'Đọc hiểu' | 'Ngữ pháp' | 'Nghe' | 'Từ vựng';

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
  date: string;
  name: string;
  type: TestCategory;
  score: number; // Thang điểm 10
}

export interface ChartDataPoint {
  name: string; // T1, T2,... T10
  reading?: number;
  grammar?: number;
  listening?: number;
  vocabulary?: number;
}