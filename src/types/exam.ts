export type Difficulty = 'Dễ' | 'TB' | 'Khó';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subject: string;
  tags?: string[];
  thumbnail?: string;
  duration: number;
  question_count: number; // DB snake_case
  difficulty?: Difficulty;
  is_new?: boolean;
  is_recommended?: boolean; // Mới thêm
  icon_char?: string;       // Mới thêm
  bg_color_class?: string;  // Mới thêm
  created_at: string;
}