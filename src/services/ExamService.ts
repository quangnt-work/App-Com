// src/services/ExamService.ts
import { ExamRepository } from "@/repositories/ExamRepository";
import { createClient } from "@/lib/supabase/server";

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
};
