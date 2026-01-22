import { z } from "zod";

export const LessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Tên bài học phải ít nhất 5 ký tự"),
  slug: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  thumbnail: z.string().url("Ảnh đại diện không hợp lệ").optional().or(z.literal('')),
  type: z.enum(['video', 'text', 'quiz', 'pdf']),
  content: z.string().optional(),
  file_url: z.string().optional(),
  status: z.boolean().default(false),
});

export type LessonInput = z.infer<typeof LessonSchema>;