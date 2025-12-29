// src/types/user.ts

export type UserRole = 'Học viên' | 'Quản trị viên';
export type UserStatus = 'Hoạt động' | 'Đã khóa';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}