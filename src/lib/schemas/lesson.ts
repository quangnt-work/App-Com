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

export const LessonSchema = z.object({
  title: z.string().min(5, "Tên bài học phải ít nhất 5 ký tự"),
  slug: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().url("Ảnh đại diện không hợp lệ").optional().or(z.literal('')),
  type: z.enum(['text', 'file']).default('text'),
  content: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).optional(),
  status: z.union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true'; 
  }),
})
  .superRefine((data, ctx) => {
  if (data.type === "text") {
    if (!data.content || data.content.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nội dung bài học không được để trống (tối thiểu 10 ký tự)",
        path: ["content"],
      });
    }
  }
    
  if (data.type === "file") {
    if (!data.file_url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng tải lên tài liệu đính kèm",
        path: ["file_url"],
      });
    }
  }
});

export type LessonInput = z.infer<typeof LessonSchema>;