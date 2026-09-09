// src/components/profile/UserProfileCard.tsx
import { UserProfile } from '@/types/profile';
import { Mail, Calendar, Edit2 } from 'lucide-react';

export function UserProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border-4 border-white shadow-sm"></div>
        <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-xs transition">
          <Edit2 size={16} />
        </button>
      </div>

      {/* Info */}
      <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
      <p className="text-slate-500 mb-4">@{profile.username}</p>
      
      <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100/80 text-indigo-700 rounded-full text-sm font-bold mb-6">
        TRÌNH ĐỘ HIỆN TẠI: {profile.level}
      </div>

      <div className="w-full border-t border-slate-100 pt-6 space-y-4">
        <div className="flex items-center text-slate-600 gap-3 text-sm">
          <Mail size={18} />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center text-slate-600 gap-3 text-sm">
          <Calendar size={18} />
          <span>Tham gia: {profile.joinDate}</span>
        </div>
      </div>
    </div>
  );
}