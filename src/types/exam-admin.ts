export interface Question {
  id?: string;
  content: string; // Nội dung đoạn văn hoặc đề bài
  type: 'multiple_choice' | 'essay' | 'reorder' | 'error_id' | 'group' | 'fill_in_blank'; 
  // 'group' = Bài đọc/Bài nghe chứa nhiều câu con
  
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  options: string[];
  correct_answer: string;
  explanation?: string;
  
  // Mới bổ sung
  parent_id?: string | null; // ID của câu cha (nếu là câu con)
  media_url?: string | null; // URL Audio
  sub_questions?: Question[]; // Chứa danh sách câu hỏi con (khi xử lý ở frontend)
}