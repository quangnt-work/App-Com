// src/types/user.ts

// Định nghĩa các Role (Quyền) của người dùng trong hệ thống
export type UserRole = 'admin' | 'student' | 'instructor' | string;

// Định nghĩa các trạng thái của người dùng
export type UserStatus = 'Hoạt động' | 'Bị khóa' | 'Chờ xác nhận' | string;

// (Tùy chọn) Định nghĩa luôn Interface cho User để dùng cho các component khác
export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at?: string | null;
  updated_at?: string | null;
}