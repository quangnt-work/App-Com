export type LessonType = 'video' | 'quiz' | 'document';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  type: LessonType;
  duration: number;
  is_published: boolean;
  order_index: number;
  created_at: string;
}