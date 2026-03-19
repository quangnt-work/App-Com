"use server";

import { ExamRepository } from "@/repositories/ExamRepository";
import { ExamService } from "@/services/ExamService";
import { ExamInput } from "@/lib/schemas/exam";
import { revalidatePath } from "next/cache";

export async function getExams(page = 1, pageSize = 10, search = "") {
  const { data, count, error } = await ExamService.getList(page, pageSize, search);
  if (error) {
    console.error("Lỗi lấy đề thi:", error);
    return { data: [], count: 0, error: (error as Error).message };
  }
  return { data, count, error: null };
}

export async function getExamQuestions(examId: string) {
  try {
    const { data, error } = await ExamService.getQuestions(examId);
    if (error) throw error;
    // Map db options JSON string back to actual questions
    const questions = data?.map((q) => q.options) || [];
    return { data: questions, error: null };
  } catch (e: unknown) {
    const error = e as Error;
    return { data: [], error: error.message };
  }
}

export async function upsertExam(payload: ExamInput, id?: string) {
  try {
    const dbPayload = {
      title: payload.title,
      description: payload.description ?? null,
      duration: payload.duration,
      level: payload.level,
      exam_type: payload.exam_type,
      status: payload.status ? "published" : "draft",
      question_count: payload.questions?.length || 0,
    };

    let examId = id;
    let error;

    if (examId) {
      // Update exam
      ({ error } = await ExamRepository.update(examId, dbPayload));
    } else {
      // Create exam
      const createPayload = {
        ...dbPayload,
        code: `EX-${Date.now()}`,
      };
      const { data, error: createError } = await ExamRepository.create(createPayload);
      error = createError;
      if (data) examId = data.id;
    }

    if (error) throw error;

    // Save questions separately if examId is available
    if (examId && payload.questions) {
      const { error: qError } = await ExamRepository.saveQuestions(examId, payload.questions);
      if (qError) throw qError;
    }

    revalidatePath("/admin/exams");
    revalidatePath("/admin/dashboard");
    return { success: true, message: id ? "Đã cập nhật đề thi" : "Đã tạo đề thi mới" };
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, message: error.message || "Không thể lưu đề thi" };
  }
}

export async function deleteExam(id: string) {
  try {
    const { error } = await ExamService.delete(id);
    if (error) throw error;

    revalidatePath("/admin/exams");
    revalidatePath("/admin/dashboard");
    return { success: true, message: "Đã xóa đề thi" };
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, message: error.message || "Không thể xóa đề thi này" };
  }
}
