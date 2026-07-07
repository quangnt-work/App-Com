// src/actions/ExamImportActions.ts
"use server";

import {
  extractText,
  parseQuestionsFromText,
  parseAnswerKey,
  mergeQuestionsWithAnswers,
  detectExamMetadata,
  convertToExamQuestions,
  type ParsedQuestion,
  type ImportStats,
  type ExamMetadata,
} from "@/lib/examImportParser";
import { ExamRepository } from "@/repositories/ExamRepository";
import { ExamService } from "@/services/ExamService";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ImportParseResult {
  success: true;
  questions: ParsedQuestion[];
  metadata: ExamMetadata;
  stats: ImportStats;
}

export interface ImportError {
  success: false;
  error: string;
}

export type ImportResult = ImportParseResult | ImportError;

export interface SaveImportedExamPayload {
  title: string;
  level: string;
  examType: string;
  duration: number;
  description?: string;
  questions: ParsedQuestion[];
}

// ─── Server Action: Parse files ──────────────────────────────────────────────

export async function importExamFromFiles(
  formData: FormData
): Promise<ImportResult> {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin")
      return { success: false, error: "Forbidden: Admin access required" };

    // 2. Get files
    const questionFile = formData.get("questionFile") as File | null;
    const answerFile = formData.get("answerFile") as File | null;

    if (!questionFile) {
      return { success: false, error: "Vui lòng upload file câu hỏi." };
    }

    // 3. Validate file types
    const allowedExtensions = ["docx", "txt"];
    const qExt = questionFile.name.split(".").pop()?.toLowerCase();
    
    if (!qExt || !allowedExtensions.includes(qExt)) {
      return {
        success: false,
        error: "File câu hỏi phải có định dạng .docx hoặc .txt",
      };
    }

    let aExt;
    if (answerFile) {
      aExt = answerFile.name.split(".").pop()?.toLowerCase();
      if (!aExt || !allowedExtensions.includes(aExt)) {
        return {
          success: false,
          error: "File đáp án phải có định dạng .docx hoặc .txt",
        };
      }
    }

    // 4. Size limit (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (questionFile.size > maxSize || (answerFile && answerFile.size > maxSize)) {
      return { success: false, error: "File không được vượt quá 10MB." };
    }

    // 5. Read files
    const qBuffer = await questionFile.arrayBuffer();
    const questionText = await extractText(qBuffer, questionFile.name);

    let answerText = "";
    if (answerFile) {
      const aBuffer = await answerFile.arrayBuffer();
      answerText = await extractText(aBuffer, answerFile.name);
    }

    if (!questionText.trim()) {
      return { success: false, error: "File câu hỏi trống hoặc không đọc được nội dung." };
    }
    if (answerFile && !answerText.trim()) {
      return { success: false, error: "File đáp án trống hoặc không đọc được nội dung." };
    }

    // 6. Parse questions
    const parsedQuestions = parseQuestionsFromText(questionText);

    if (parsedQuestions.length === 0) {
      return {
        success: false,
        error:
          "Không tìm thấy câu hỏi nào trong file. Vui lòng kiểm tra format (mỗi câu bắt đầu bằng số thứ tự, ví dụ: 1. Câu hỏi...)",
      };
    }

    // 7. Parse answer key
    let answerKey = new Map<number, string>();
    if (answerText.trim()) {
      answerKey = parseAnswerKey(answerText);
      if (answerKey.size === 0) {
        return {
          success: false,
          error:
            'Không tìm thấy đáp án nào trong file đáp án. Vui lòng kiểm tra format (ví dụ: 1-А, 2-Б, 3-В)',
        };
      }
    }

    // 8. Merge
    const { questions, stats } = mergeQuestionsWithAnswers(
      parsedQuestions,
      answerKey
    );

    // 9. Detect metadata
    const metadata = detectExamMetadata(questionText);

    return {
      success: true,
      questions,
      metadata,
      stats,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Import error:", error);
    return {
      success: false,
      error: error.message || "Lỗi hệ thống khi import file.",
    };
  }
}

// ─── Server Action: Save imported exam ───────────────────────────────────────

export async function saveImportedExam(
  payload: SaveImportedExamPayload
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin")
      return { success: false, message: "Forbidden" };

    // 2. Validate - only save questions that have a correct answer
    const validQuestions = payload.questions.filter(
      (q) => q.correctIndex !== undefined && q.options.length >= 2
    );

    if (validQuestions.length === 0) {
      return {
        success: false,
        message: "Không có câu hỏi hợp lệ nào để lưu (cần có đáp án đúng).",
      };
    }

    // 3. Create exam record
    const dbPayload = {
      title: payload.title,
      description: payload.description ?? null,
      duration: payload.duration,
      level: payload.level,
      exam_type: payload.examType,
      status: "published",
      question_count: validQuestions.length,
      code: `EX-${Date.now()}`,
    };

    const { data: examData, error: createError } =
      await ExamRepository.create(dbPayload);
    if (createError || !examData) {
      throw new Error(
        (createError as unknown as Error)?.message || "Không thể tạo đề thi."
      );
    }

    // 4. Convert and save questions
    const examQuestions = convertToExamQuestions(validQuestions);
    const { error: qError } = await ExamRepository.saveQuestions(
      examData.id,
      examQuestions
    );
    if (qError) {
      throw new Error(
        (qError as unknown as Error)?.message || "Không thể lưu câu hỏi."
      );
    }

    // 5. Revalidate
    revalidatePath("/admin/exams");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Đã import thành công ${validQuestions.length} câu hỏi!`,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Save import error:", error);
    return {
      success: false,
      message: error.message || "Lỗi hệ thống khi lưu đề thi.",
    };
  }
}
