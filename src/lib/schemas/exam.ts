// src/lib/schemas/exam.ts
import { z } from "zod";

// ─── Question type discriminants ───────────────────────────────────────────

/** 1. Đọc hiểu + trắc nghiệm (chọn 1 hoặc nhiều đáp án) */
const ReadingMCQSchema = z.object({
  question_type: z.literal("reading_mcq"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  passage: z.string().min(1, "Vui lòng nhập đoạn văn"),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  selection_mode: z.enum(["single", "multi"]),
  options: z
    .array(z.string().min(1, "Không được để trống đáp án"))
    .min(2, "Cần ít nhất 2 đáp án"),
  correct_indexes: z.array(z.number()).min(1, "Chọn ít nhất 1 đáp án đúng"),
  explanation: z.string().optional(),
});

/** 1.5 Nhóm Đọc hiểu (dành cho Admin Form Editor) */
const ReadingGroupSchema = z.object({
  question_type: z.literal("reading_group"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  passage: z.string().min(1, "Vui lòng nhập đoạn văn"),
  sub_questions: z.array(z.object({
    id: z.string().optional(),
    question: z.string().min(1, "Vui lòng nhập câu hỏi"),
    selection_mode: z.enum(["single", "multi"]),
    options: z.array(z.string().min(1, "Không được để trống đáp án")).min(2, "Cần ít nhất 2 đáp án"),
    correct_indexes: z.array(z.number()).min(1, "Chọn ít nhất 1 đáp án đúng"),
    explanation: z.string().optional(),
  })).min(1, "Cần ít nhất 1 câu hỏi con"),
});

/** 2. Đọc hiểu + câu hỏi mở (trả lời theo bài đọc) */
const ReadingOpenEndedSchema = z.object({
  question_type: z.literal("reading_open"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  passage: z.string().min(1, "Vui lòng nhập đoạn văn"),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  sample_answer: z.string().optional(),
});

/** 3. Nghe audio + trắc nghiệm (chọn 1 hoặc nhiều đáp án) */
const ListeningMCQSchema = z.object({
  question_type: z.literal("listening_mcq"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  audio_url: z.string().min(1, "Vui lòng upload file audio").optional().or(z.literal("")),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  selection_mode: z.enum(["single", "multi"]),
  options: z
    .array(z.string().min(1, "Không được để trống đáp án"))
    .min(2, "Cần ít nhất 2 đáp án"),
  correct_indexes: z.array(z.number()).min(1, "Chọn ít nhất 1 đáp án đúng"),
  explanation: z.string().optional(),
});

/** 3.5 Nhóm Nghe hiểu (dành cho Admin Form Editor) */
const ListeningGroupSchema = z.object({
  question_type: z.literal("listening_group"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  audio_url: z.string().min(1, "Vui lòng upload file audio").optional().or(z.literal("")),
  sub_questions: z.array(z.object({
    id: z.string().optional(),
    question: z.string().min(1, "Vui lòng nhập câu hỏi"),
    selection_mode: z.enum(["single", "multi"]),
    options: z.array(z.string().min(1, "Không được để trống đáp án")).min(2, "Cần ít nhất 2 đáp án"),
    correct_indexes: z.array(z.number()).min(1, "Chọn ít nhất 1 đáp án đúng"),
    explanation: z.string().optional(),
  })).min(1, "Cần ít nhất 1 câu hỏi con"),
});

/** 4. Nghe audio + câu hỏi mở */
const ListeningOpenEndedSchema = z.object({
  question_type: z.literal("listening_open"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  audio_url: z.string().optional().or(z.literal("")),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  sample_answer: z.string().optional(),
});

/** 5. Nghe audio + điền từ còn thiếu */
const ListeningFillBlankSchema = z.object({
  question_type: z.literal("listening_fill"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  audio_url: z.string().optional().or(z.literal("")),
  /** Transcript có dấu _____ cho chỗ trống */
  transcript_template: z
    .string()
    .min(1, "Vui lòng nhập transcript có chứa _____"),
  /** Danh sách đáp án điền vào chỗ trống (theo thứ tự) */
  correct_answers: z.array(z.string().min(1)).min(1, "Cần ít nhất 1 chỗ trống"),
});

/** 6. Sắp xếp từ thành câu */
const WordArrangementSchema = z.object({
  question_type: z.literal("word_arrangement"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  context: z.string().optional(),
  /** Các từ cho trước (sẽ được xáo trộn khi thi) */
  words: z
    .array(z.string().min(1))
    .min(2, "Cần ít nhất 2 từ"),
  correct_sentence: z.string().min(1, "Vui lòng nhập câu đúng"),
  explanation: z.string().optional(),
});

/** 7. Tìm lỗi sai trong câu và sửa lại */
const ErrorCorrectionSchema = z.object({
  question_type: z.literal("error_correction"),
  id: z.string().optional(),
  instruction: z.string().optional(),
  sentence: z.string().min(1, "Vui lòng nhập câu có lỗi"),
  wrong_part: z.string().min(1, "Nhập phần bị lỗi"),
  correct_part: z.string().min(1, "Nhập cách sửa đúng"),
  explanation: z.string().optional(),
});

// ─── Union ──────────────────────────────────────────────────────────────────

export const ExamQuestionSchema = z.discriminatedUnion("question_type", [
  ReadingMCQSchema,
  ReadingOpenEndedSchema,
  ListeningMCQSchema,
  ListeningOpenEndedSchema,
  ListeningFillBlankSchema,
  WordArrangementSchema,
  ErrorCorrectionSchema,
  ReadingGroupSchema,
  ListeningGroupSchema,
]);

// ─── Exam Form Schema ────────────────────────────────────────────────────────

export const ExamSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Tên đề thi không được để trống"),
  exam_type: z.enum(["grammar", "reading", "listening", "mixed"], {
    error: "Vui lòng chọn loại đề thi",
  }),
  duration: z
    .number({ error: "Thời gian phải là số" })
    .int()
    .positive("Thời gian phải lớn hơn 0"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "all"], {
    error: "Vui lòng chọn cấp độ đề thi",
  }),
  description: z.string().optional(),
  status: z.boolean(),
  questions: z.array(ExamQuestionSchema),
});

export type ExamInput = z.infer<typeof ExamSchema>;
export type ExamQuestion = z.infer<typeof ExamQuestionSchema>;
export type ExamQuestionType = ExamQuestion["question_type"];

// ─── Label map ───────────────────────────────────────────────────────────────

export const EXAM_TYPE_LABELS: Record<string, string> = {
  grammar: "Ngữ pháp",
  reading: "Đọc hiểu",
  listening: "Nghe hiểu",
  mixed: "Tổng hợp",
};

export const EXAM_LEVEL_LABELS: Record<string, string> = {
  A1: "A1 - Cơ bản",
  A2: "A2 - Sơ cấp",
  B1: "B1 - Trung cấp",
  B2: "B2 - Thượng cấp",
  C1: "C1 - Cao cấp",
  C2: "C2 - Thành thạo",
  all: "Mọi cấp độ",
};

export const QUESTION_TYPE_LABELS: Record<ExamQuestionType | "reading_group" | "listening_group", string> = {
  reading_group: "Đọc hiểu — Trắc nghiệm (Nhóm bài)",
  reading_mcq: "Đọc hiểu — Trắc nghiệm",
  reading_open: "Đọc hiểu — Câu hỏi mở",
  listening_group: "Nghe audio — Trắc nghiệm (Nhóm bài)",
  listening_mcq: "Nghe audio — Trắc nghiệm",
  listening_open: "Nghe audio — Câu hỏi mở",
  listening_fill: "Nghe audio — Điền từ còn thiếu",
  word_arrangement: "Sắp xếp từ thành câu",
  error_correction: "Tìm lỗi sai và sửa lại",
};
