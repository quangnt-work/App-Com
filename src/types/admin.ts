export interface DashboardStatsType {
  totalStudents: number;
  totalGrammars: number;
  totalResources: number;
  totalPractice: number;
  // Per-type lesson counts
  grammarFileCount: number;
  audioCount: number;
  videoCount: number;
}