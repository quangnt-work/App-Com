import { z } from "zod";

export const LessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Tên bài học phải ít nhất 5 ký tự"),
  slug: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().url("Ảnh đại diện không hợp lệ").optional().or(z.literal('')),
  type: z.enum(['video', 'text', 'quiz', 'file']).default('text'),
  content: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  status: z.boolean().default(false),
});

export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  options: z.array(z.string()).length(4, "Phải có đủ 4 đáp án"),
  correct_answer: z.number().min(0).max(3),
});

export type LessonInput = z.infer<typeof LessonSchema>;