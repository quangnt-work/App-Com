// src/types/database-custom.ts
import { Database } from "./database.type"; // File gen từ Supabase

// Helper để lấy Row type nhanh
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Định nghĩa Business Types
export type Course = Tables<"courses"> & {
  lessons_count?: number; // Trường ảo khi join
};

export type Lesson = Tables<"lessons">;
export type Exam = Tables<"exams">;
export type Question = Tables<"exam_questions">;
export type UserProfile = Tables<"profiles">;

// Common Status Type (Dùng chung cho badge)
export type CommonStatus =
  | "active"
  | "draft"
  | "archived"
  | "published"
  | "private";
