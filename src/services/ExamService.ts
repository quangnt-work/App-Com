// src/services/ExamService.ts
import { ExamRepository } from "@/repositories/ExamRepository";
import { createClient } from "@/lib/supabase/server";
import { ExamInput } from "@/lib/schemas/exam";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden: Admin access required");
}

export const ExamService = {
  async getList(page: number, pageSize: number, search: string) {
    return await ExamRepository.getList({ page, pageSize, search });
  },

  async delete(id: string) {
    await requireAdmin();
    return await ExamRepository.delete(id);
  },

  async getDetail(id: string) {
    return await ExamRepository.getById(id);
  },

  async getQuestions(examId: string) {
    return await ExamRepository.getQuestions(examId);
  },

  async upsert(payload: ExamInput, id?: string) {
    await requireAdmin();
    
    const flatQuestions: any[] = [];
    if (payload.questions) {
      for (const q of payload.questions) {
        if (q.question_type === 'reading_group') {
          for (const sub of q.sub_questions) {
             flatQuestions.push({
               question_type: 'reading_mcq',
               passage: q.passage,
               instruction: q.instruction,
               question: sub.question,
               selection_mode: sub.selection_mode,
               options: sub.options,
               correct_indexes: sub.correct_indexes,
               explanation: sub.explanation
             });
          }
        } else if (q.question_type === 'listening_group') {
          for (const sub of q.sub_questions) {
             flatQuestions.push({
               question_type: 'listening_mcq',
               audio_url: q.audio_url,
               instruction: q.instruction,
               question: sub.question,
               selection_mode: sub.selection_mode,
               options: sub.options,
               correct_indexes: sub.correct_indexes,
               explanation: sub.explanation
             });
          }
        } else {
          flatQuestions.push(q);
        }
      }
    }

    const dbPayload = {
      title: payload.title,
      description: payload.description ?? null,
      duration: payload.duration,
      level: payload.level,
      exam_type: payload.exam_type,
      status: payload.status ? "published" : "draft",
      question_count: flatQuestions.length,
    };

    let examId = id;
    let error;

    if (examId) {
      ({ error } = await ExamRepository.update(examId, dbPayload));
    } else {
      const createPayload = {
        ...dbPayload,
        code: `EX-${Date.now()}`,
      };
      const { data, error: createError } = await ExamRepository.create(createPayload);
      error = createError;
      if (data) examId = data.id;
    }

    if (error) throw error;

    if (examId) {
      const { error: qError } = await ExamRepository.saveQuestions(examId, flatQuestions);
      if (qError) throw qError;
    }
  },
};
