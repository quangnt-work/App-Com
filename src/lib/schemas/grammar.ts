import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  options: z
    .array(z.string().min(1, { message: "Nhập nội dung đáp án" }))
    .min(2, { message: "Cần tối thiểu 2 đáp án" }),
  correct_answer: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

export const GrammarSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  slug: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().url("Ảnh đại diện không hợp lệ").optional().or(z.literal('')),
  type: z.enum(['text', 'file', 'video', 'quiz', 'audio']),
  content: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).optional(),
  status: z.boolean(),
});

// Giờ đây Output và Input đã khớp nhau 100%, không còn lỗi khi build
export type GrammarInput = z.infer<typeof GrammarSchema>;