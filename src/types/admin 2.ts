export interface StudentWithStats {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string | null;
  level: string | null;
  examCount: number;
  highestScore: number | null;
}

export interface DashboardStatsType {
  totalStudents: number;
  totalGrammars: number;
  totalDocuments: number;
  totalExams: number;
  totalPractice: number; // Tạm giữ lại nếu sau này làm tới bảng bài tập
  // Per-type lesson counts
  grammarFileCount: number;
  audioCount: number;
  videoCount: number;
  // Per-type exam counts
  examMixedCount: number;
  examGrammarCount: number;
  examReadingCount: number;
  examListeningCount: number;
}