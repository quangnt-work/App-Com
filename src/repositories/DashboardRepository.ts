import { createClient } from "@/lib/supabase/server";

export const DashboardRepository = {
  async getStats() {
    const supabase = await createClient();

    const [
      { count: studentCount },
      { count: grammarCount },
      { count: docCount },
      { count: examCount },
      { count: practiceCount },
      { count: grammarFileCount },
      { count: audioCount },
      { count: videoCount },
      { count: examMixedCount },
      { count: examGrammarCount },
      { count: examReadingCount },
      { count: examListeningCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("grammars").select("*", { count: "exact", head: true }),
      supabase.from("documents").select("*", { count: "exact", head: true }),
      supabase.from("exams").select("*", { count: "exact", head: true }),
      supabase.from("practice_exercises").select("*", { count: "exact", head: true }),
      supabase.from("grammars").select("*", { count: "exact", head: true }).eq("type", "file"),
      supabase.from("grammars").select("*", { count: "exact", head: true }).eq("type", "audio"),
      supabase.from("grammars").select("*", { count: "exact", head: true }).eq("type", "video"),
      supabase.from("exams").select("*", { count: "exact", head: true }).eq("exam_type", "mixed"),
      supabase.from("exams").select("*", { count: "exact", head: true }).eq("exam_type", "grammar"),
      supabase.from("exams").select("*", { count: "exact", head: true }).eq("exam_type", "reading"),
      supabase.from("exams").select("*", { count: "exact", head: true }).eq("exam_type", "listening"),
    ]);

    return {
      totalStudents: studentCount || 0,
      totalGrammars: grammarCount || 0,
      totalDocuments: docCount || 0,
      totalExams: examCount || 0,
      totalPractice: practiceCount || 0,
      grammarFileCount: grammarFileCount || 0,
      audioCount: audioCount || 0,
      videoCount: videoCount || 0,
      examMixedCount: examMixedCount || 0,
      examGrammarCount: examGrammarCount || 0,
      examReadingCount: examReadingCount || 0,
      examListeningCount: examListeningCount || 0,
    };
  },
};
