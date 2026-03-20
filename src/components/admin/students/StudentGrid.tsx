// src/components/admin/students/StudentGrid.tsx
import { Users } from "lucide-react";
import { StudentWithStats } from "@/types/admin";
import { StudentCard } from "./StudentCard";

interface StudentGridProps {
  students: StudentWithStats[];
}

export function StudentGrid({ students }: StudentGridProps) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
        <Users size={56} className="mb-4 opacity-30" />
        <p className="text-lg font-semibold">Không tìm thấy học viên</p>
        <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
