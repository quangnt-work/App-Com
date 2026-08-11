"use server";

import { ExamRepository } from "@/repositories/ExamRepository";
import { ExamService } from "@/services/ExamService";
import { ExamInput, ExamQuestion } from "@/lib/schemas/exam";
import { revalidatePath } from "next/cache";

export async function getExams(page = 1, pageSize = 10, search = "") {
  const { data, count, error } = await ExamService.getList(page, pageSize, search);
  if (error) {
    console.error("Lỗi lấy đề thi:", error);
    return { data: [], count: 0, error: (error as Error).message };
  }
  return { data, count, error: null };
}

export async function getExamDetail(id: string) {
  try {
    const { data, error } = await ExamService.getDetail(id);
    if (error) throw error;
    return { data, error: null };
  } catch (e: unknown) {
    const error = e as Error;
    return { data: null, error: error.message };
  }
}

export async function getExamQuestions(examId: string) {
  try {
    const { data, error } = await ExamService.getQuestions(examId);
    if (error) throw error;
    // Map db options JSON string back to actual questions
    const questions = (data?.map((q) => q.options) || []) as ExamQuestion[];

    const groupedQuestions: ExamQuestion[] = [];
    let currentReadingGroup: Extract<ExamQuestion, { question_type: 'reading_group' }> | null = null;

    for (const q of questions) {
      if (q.question_type === 'reading_mcq') {
         if (currentReadingGroup && currentReadingGroup.passage === q.passage) {
            // Add to existing group
            currentReadingGroup.sub_questions.push({
              question: q.question,
              selection_mode: q.selection_mode,
              options: q.options,
              correct_indexes: q.correct_indexes,
              explanation: q.explanation,
            });
         } else {
            // Finish previous group if exists
            if (currentReadingGroup) {
              groupedQuestions.push(currentReadingGroup);
            }
            // Start new group
            currentReadingGroup = {
              question_type: 'reading_group',
              passage: q.passage,
              instruction: q.instruction,
              sub_questions: [{
                question: q.question,
                selection_mode: q.selection_mode,
                options: q.options,
                correct_indexes: q.correct_indexes,
                explanation: q.explanation,
              }],
            };
         }
      } else {
         if (currentReadingGroup) {
            groupedQuestions.push(currentReadingGroup);
            currentReadingGroup = null;
         }
         groupedQuestions.push(q);
      }
    }
    if (currentReadingGroup) {
      groupedQuestions.push(currentReadingGroup);
    }

    // Pass 2: Group consecutive listening_mcq into listening_group
    const finalGroupedQuestions: ExamQuestion[] = [];
    let currentListeningGroup: Extract<ExamQuestion, { question_type: 'listening_group' }> | null = null;

    for (const q of groupedQuestions) {
      if (q.question_type === 'listening_mcq' && q.audio_url) {
        if (currentListeningGroup && currentListeningGroup.audio_url === q.audio_url) {
          // Add to existing group
          currentListeningGroup.sub_questions.push({
            question: q.question,
            selection_mode: q.selection_mode,
            options: q.options,
            correct_indexes: q.correct_indexes,
            explanation: q.explanation,
          });
        } else {
          if (currentListeningGroup) finalGroupedQuestions.push(currentListeningGroup);
          currentListeningGroup = {
            question_type: 'listening_group',
            audio_url: q.audio_url,
            instruction: q.instruction,
            sub_questions: [{
              question: q.question,
              selection_mode: q.selection_mode,
              options: q.options,
              correct_indexes: q.correct_indexes,
              explanation: q.explanation,
            }]
          };
        }
      } else {
        if (currentListeningGroup) {
          finalGroupedQuestions.push(currentListeningGroup);
          currentListeningGroup = null;
        }
        finalGroupedQuestions.push(q);
      }
    }
    if (currentListeningGroup) {
      finalGroupedQuestions.push(currentListeningGroup);
    }

    return { data: finalGroupedQuestions, error: null };
  } catch (e: unknown) {
    const error = e as Error;
    return { data: [], error: error.message };
  }
}

export async function upsertExam(payload: ExamInput, id?: string) {
  try {
    await ExamService.upsert(payload, id);

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
