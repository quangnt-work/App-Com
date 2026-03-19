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
}