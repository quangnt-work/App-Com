// src/components/profile/UserProfileCard.tsx
import { UserProfile } from '@/types/profile';
import { Mail, Calendar, Edit2 } from 'lucide-react';

export function UserProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full bg-[#fcdbb6] border-4 border-white shadow-sm"></div>
        <button className="absolute bottom-0 right-0 p-2 bg-[#7c3aed] text-white rounded-full hover:bg-purple-700 transition">
          <Edit2 size={16} />
        </button>
      </div>

      {/* Info */}
      <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
      <p className="text-gray-500 mb-4">@{profile.username}</p>
      
      <div className="px-4 py-1.5 bg-purple-100 text-[#7c3aed] rounded-full text-sm font-bold mb-6">
        TRÌNH ĐỘ HIỆN TẠI: {profile.level}
      </div>

      <div className="w-full border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-center text-gray-600 gap-3 text-sm">
          <Mail size={18} />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center text-gray-600 gap-3 text-sm">
          <Calendar size={18} />
          <span>Tham gia: {profile.joinDate}</span>
        </div>
      </div>
    </div>
  );
}