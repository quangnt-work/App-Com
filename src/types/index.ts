// src/types/index.ts
import { Database } from './supabase';

// 1. Helper Types cho các bảng (Sử dụng trực tiếp từ DB)
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbCourse = Database['public']['Tables']['courses']['Row'];
export type DbDocument = Database['public']['Tables']['documents']['Row'];
export type DbExam = Database['public']['Tables']['exams']['Row'];
export type DbLesson = Database['public']['Tables']['lessons']['Row'];
export type DbQuestion = Database['public']['Tables']['exam_questions']['Row'];
export type DbSubmission = Database['public']['Tables']['exam_submissions']['Row'];

// 2. Helper Types cho Enums (Rất hữu ích cho Dropdown/Select)
export type UserRole = Database['public']['Enums']['user_role'];
export type QuestionType = Database['public']['Enums']['question_type'];
export type SubmissionStatus = Database['public']['Enums']['submission_status'];
export type PracticeSkill = Database['public']['Enums']['practice_skill'];

// 3. Relation Types (Dùng cho các trang hiển thị danh sách có Join bảng)

// Dùng cho trang Admin Courses: Lấy Course + Thông tin Giảng viên + Số lượng bài học
export type CourseWithRelations = DbCourse & {
  // Vì query là: profiles:instructor_id(...) nên key là profiles
  profiles: Pick<DbProfile, 'full_name' | 'avatar_url'> | null; 
  // Vì query là: lessons(count)
  lessons: { count: number }[];
};

// Dùng cho trang Admin Documents: Lấy Document + Người upload + Tên khóa học
export type DocumentWithRelations = DbDocument & {
  profiles: Pick<DbProfile, 'full_name'> | null;
  courses: Pick<DbCourse, 'title'> | null;
};

// Dùng cho trang Exam Detail: Lấy Exam + Danh sách câu hỏi
export type ExamWithQuestions = DbExam & {
  exam_questions: DbQuestion[];
};

export type UIQuestion = Omit<DbQuestion, 'options' | 'id'> & {
  id?: string; // ID có thể null nếu là câu hỏi mới thêm trên UI
  options: string[]; // Bắt buộc là mảng string để map ra input
};