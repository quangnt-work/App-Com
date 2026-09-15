// src/components/admin/students/StudentCard.tsx
import Link from "next/link";
import { Calendar, BookOpen, Trophy, ChevronRight, GraduationCap } from "lucide-react";
import { StudentWithStats } from "@/types/admin";
import { UserAvatar } from "@/components/common/UserAvatar";
import { formatDate, getLevelBadgeClass } from "@/lib/utils";

interface StudentCardProps {
  student: StudentWithStats;
}

export function StudentCard({ student }: StudentCardProps) {
  const displayName = student.full_name ?? student.username ?? "Học viên";
  const levelLabel = student.level ?? "Chưa xếp loại";
  const levelStyle = student.level ? getLevelBadgeClass(student.level) : "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
      {/* Avatar */}
      <UserAvatar
        src={student.avatar_url}
        name={displayName}
        className="w-16 h-16 mb-4 border-2 border-orange-100 shadow-sm"
        fallbackClassName="bg-orange-50 text-[#ea580c] text-xl font-bold"
      />

      {/* Thông tin chính */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate w-full">{displayName}</h3>
      {student.username && (
        <p className="text-gray-500 text-sm mb-3 w-full truncate">@{student.username}</p>
      )}

      {/* Level badge */}
      <span className={`inline-flex items-center mb-4 text-xs font-semibold px-3 py-1 rounded-full ${levelStyle}`}>
        <GraduationCap size={14} className="mr-1.5" />
        {levelLabel}
      </span>

      {/* Thông tin phụ */}
      <div className="w-full flex flex-col gap-2 mb-6 sm:mb-8 text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Calendar size={16} className="text-orange-400" />
          <span>Tham gia: {formatDate(student.created_at)}</span>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5" title="Số bài kiểm tra">
            <BookOpen size={16} className="text-orange-500" />
            <span className="font-medium">{student.examCount} bài</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5" title="Điểm cao nhất">
            <Trophy size={16} className="text-amber-500" />
            <span className="font-medium">{student.highestScore ?? "—"} điểm</span>
          </div>
        </div>
      </div>

      {/* Nút điều hướng */}
      <Link
        href={`/admin/students/${student.id}`}
        className="mt-auto w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
      >
        Chi tiết <ChevronRight size={18} />
      </Link>
    </div>
  );
}

export default StudentCard;
