import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Tên khóa học phải ít nhất 5 ký tự"),
  description: z.string().optional(),
  category: z.enum(["TIENG_ANH", "TIENG_NGA", "CNTT", "KHAC"]), // Enum chuẩn
  price: z.number().min(0).default(0),
  thumbnail: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().default(false),
});

export type CourseInput = z.infer<typeof CourseSchema>;