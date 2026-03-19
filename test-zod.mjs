import { z } from "zod";

const ReadingMCQSchema = z.object({
  question_type: z.literal("reading_mcq"),
  id: z.string().optional(),
  passage: z.string().min(1, "Vui lòng nhập đoạn văn"),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  selection_mode: z.enum(["single", "multi"]).default("single"),
  options: z
    .array(z.string().min(1, "Không được để trống đáp án"))
    .min(2, "Cần ít nhất 2 đáp án"),
  correct_indexes: z.array(z.number()).min(1, "Chọn ít nhất 1 đáp án đúng"),
  explanation: z.string().optional(),
});

const defaultValues = {
  title: "",
  exam_type: "grammar",
  duration: 60,
  description: "",
  status: false,
  questions: [],
};

const ExamSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Tên đề thi không được để trống"),
  exam_type: z.enum(["grammar", "reading", "listening", "mixed"], {
    error: "Vui lòng chọn loại đề thi",
  }),
  duration: z
    .number({ error: "Thời gian phải là số" })
    .int()
    .positive("Thời gian phải lớn hơn 0"),
  description: z.string().optional(),
  status: z.boolean().default(false),
  questions: z.array(z.any()).default([]),
});

const result = ExamSchema.safeParse(defaultValues);
console.log(JSON.stringify(result, null, 2));

const invalidData = {
  title: "A",
  exam_type: "grammar",
  duration: 60,
  description: "",
  status: false,
  questions: [
    {
      question_type: "reading_mcq",
      passage: "",
      question: "",
      selection_mode: "single",
      options: ["", ""],
      correct_indexes: [],
    }
  ]
};

const result2 = ExamSchema.safeParse(invalidData);
console.log(JSON.stringify(result2, null, 2));
