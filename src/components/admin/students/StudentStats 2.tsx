// src/components/admin/students/StudentStats.tsx
import { GraduationCap, Award, BookOpen } from "lucide-react";

interface StudentStatsProps {
  level: string | null;
  averageScore: number;
  examCount: number;
}

export function StudentStats({ level, averageScore, examCount }: StudentStatsProps) {
  const displayLevel = level ?? "Chưa xếp loại";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
          <GraduationCap size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Trình độ hiện tại</p>
        <p className="text-2xl font-bold text-gray-900">{displayLevel}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <BookOpen size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tổng số bài làm</p>
        <p className="text-2xl font-bold text-gray-900">{examCount}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
          <Award size={24} />
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Điểm trung bình</p>
        <p className="text-2xl font-bold text-gray-900">
          {averageScore > 0 ? averageScore.toFixed(2) : "—"}
        </p>
      </div>
    </div>
  );
}
