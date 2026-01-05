import React from 'react';
import { User } from '@/types/user';
import { Mail, Calendar, MapPin, Shield } from 'lucide-react';

export function UserProfileCard({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-sky-50 mb-4"
        />
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-2">
          {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
        </span>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Tham gia: 20/12/2025</span> {/* Mock data hoặc lấy từ DB */}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-gray-400" />
          <span>Trạng thái: <span className="text-green-600 font-medium">Hoạt động</span></span>
        </div>
      </div>
    </div>
  );
}