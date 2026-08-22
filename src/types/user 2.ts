// src/types/user.ts

// Định nghĩa các Role (Quyền) của người dùng trong hệ thống
export type UserRole = 'admin' | 'student' | 'instructor' | string;

// (Tùy chọn) Định nghĩa luôn Interface cho User để dùng cho các component khác
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface FeatureItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  buttonLabel: string;
  color?: string;
}