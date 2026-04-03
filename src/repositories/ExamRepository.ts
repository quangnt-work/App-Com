// src/repositories/ExamRepository.ts
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.type";

type ExamInsert = Database["public"]["Tables"]["exams"]["Insert"];
type ExamUpdate = Database["public"]["Tables"]["exams"]["Update"];

interface GetExamsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const ExamRepository = {
  async getList({ page = 1, pageSize = 10, search }: GetExamsParams) {
    const supabase = await createClient();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase.from("exams").select("*", { count: "exact" });

    if (search) query = query.ilike("title", `%${search}%`);

    return await query
      .range(start, end)
      .order("created_at", { ascending: false });
  },

  async getById(id: string) {
    const supabase = await createClient();
    return supabase.from("exams").select("*").eq("id", id).single();
  },

  async getQuestions(examId: string) {
    const supabase = await createClient();
    return supabase
      .from("exam_questions")
      .select("*")
      .eq("exam_id", examId)
      .order("order_index", { ascending: true });
  },

  async create(payload: ExamInsert) {
    const supabase = await createClient();
    return supabase.from("exams").insert(payload).select("id").single();
  },

  async update(id: string, payload: ExamUpdate) {
    const supabase = await createClient();
    return supabase.from("exams").update(payload).eq("id", id);
  },

  async delete(id: string) {
    const supabase = await createClient();
    
    // Tìm các submissions để xóa chi tiết kết quả (nếu không có ON DELETE CASCADE)
    const { data: subs } = await supabase.from("exam_submissions").select("id").eq("exam_id", id);
    if (subs && subs.length > 0) {
      const subIds = subs.map(s => s.id);
      // Bỏ qua lỗi nếu table chưa được tạo hoặc không có record
      await (supabase as any).from("submission_question_results").delete().in("submission_id", subIds);
      await supabase.from("exam_submissions").delete().in("id", subIds);
    }
    
    // Xóa các câu hỏi của đề
    await supabase.from("exam_questions").delete().eq("exam_id", id);
    
    // Bắt đầu xóa thật bản ghi chính
    const { data, error } = await supabase.from("exams").delete().eq("id", id).select("id");
    
    if (error) return { error };
    if (!data || data.length === 0) return { error: { message: "Bản ghi không tồn tại hoặc bạn không có quyền xóa" } };
    
    return { data, error: null };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveQuestions(examId: string, questions: any[]) {
    const supabase = await createClient();
    
    // Lấy các câu hỏi cũ để lấy ID (dùng cho việc upsert đè lên thay vì chỉ insert)
    const { data: existingQs } = await supabase
      .from("exam_questions")
      .select("id")
      .eq("exam_id", examId)
      .order("order_index", { ascending: true });

    // Cố gắng xoá hết cũ (nếu Policy cho phép)
    const { error: deleteError } = await supabase
      .from("exam_questions")
      .delete()
      .eq("exam_id", examId);

    if (deleteError) {
      console.warn("Lỗi khi xóa câu hỏi cũ (có thể do RLS), sẽ dùng UPSERT đè lên:", deleteError);
    }
    
    // Insert hoặc Upsert mới
    if (questions.length > 0) {
      const dbQuestions = questions.map((q, i) => {
        // Nếu có ID cũ tương ứng (và delete không thành công hoặc ta muốn tái sử dụng ID), ta gán vào để ghi đè
        const existingId = existingQs && existingQs[i] ? existingQs[i].id : undefined;
        return {
          ...(existingId ? { id: existingId } : {}), // merge id vào
          exam_id: examId,
          type: q.question_type, // or map strictly
          content: JSON.stringify(q), // store all details in content/options
          options: q, // store full object in json field for easy retrieval later
          created_at: new Date().toISOString(),
          order_index: i,
        };
      });
      
      const { error: upsertError } = await supabase.from("exam_questions").upsert(dbQuestions);
      if (upsertError) return { error: upsertError };
      
      // Khắc phục: nếu danh sách mới ngắn hơn danh sách cũ, xử lý rác
      if (existingQs && questions.length < existingQs.length) {
        const excessIds = existingQs.slice(questions.length).map(q => q.id);
        const { error: excessDelError } = await supabase.from("exam_questions").delete().in("id", excessIds);
        if (excessDelError) {
          console.warn("Lỗi xóa các câu hỏi thừa:", excessDelError);
        }
      }
    }
    return { error: null };
  }
};
