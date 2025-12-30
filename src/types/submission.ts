export interface Submission {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Foreign Keys & Relationships
  user_id: string;
  lesson_id: string;

  // Submission Content (Bài làm của học viên)
  content: string | null;   // Nội dung text (Rich text hoặc plain text)
  file_url: string | null;  // Đường dẫn file đính kèm (nếu có)

  // Grading Result (Kết quả chấm)
  score: number | null;     // Điểm số. Nếu null nghĩa là chưa chấm.
  feedback: string | null;  // Nhận xét của giáo viên

  // Joined Data (Dữ liệu lấy từ bảng khác khi query)
  // Lưu ý: Tùy vào câu query Supabase của bạn, các trường này có thể nằm trong object lồng nhau (VD: lesson: { title: string }).
  // Tuy nhiên, để tiện cho việc render ở UI component, mình khuyên nên flat (làm phẳng) dữ liệu này trước khi truyền vào component.
  lesson_title: string;     // Tên bài học (Hiển thị ở Sidebar và Header)
  lesson_slug?: string;     // Slug bài học (nếu cần link tới bài học)
  
  // Optional: Thông tin người nộp (nếu cần hiển thị avatar/tên trong view chi tiết)
  student_name?: string;
  student_email?: string;
  student_avatar?: string;
}

// Type bổ trợ cho Status (nếu cần dùng để filter)
export type SubmissionStatus = 'pending' | 'graded';