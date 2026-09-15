// src/components/admin/students/StudentDetailHeader.tsx
import { BackButton } from "@/components/common/BackButton";
import { Calendar } from "lucide-react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { formatDate } from "@/lib/utils";

interface StudentDetailHeaderProps {
  profile: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    created_at: string | null;
  };
}

export function StudentDetailHeader({ profile }: StudentDetailHeaderProps) {
  const displayName = profile.full_name ?? profile.username ?? "Học viên";

  const joinedDate = formatDate(profile.created_at);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <UserAvatar
          src={profile.avatar_url}
          name={displayName}
          className="w-24 h-24 border-4 border-orange-100 shadow-sm"
          fallbackClassName="bg-orange-50 text-[#ea580c] text-3xl font-bold"
        />

        {/* Info */}
        <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
          {profile.username && (
            <p className="text-gray-500 font-medium text-lg mb-4">@{profile.username}</p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-orange-400" />
              <span>Tham gia: {joinedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
