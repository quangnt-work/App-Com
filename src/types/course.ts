export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail: string | null;
  category: "TIẾNG ANH" | "TIẾNG NGA" | "CNTT" | "KHÁC"; 
  duration: string;
  lessons_count: number; // Lưu ý: DB thường dùng snake_case
  rating: number;
  instructor_name: string;
  instructor_avatar: string | null;
  created_at: string;
}