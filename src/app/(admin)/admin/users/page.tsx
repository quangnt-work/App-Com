import { createClient } from '@/lib/supabase/server';
import UserClient from './UserClient';
import { User, UserRole, UserStatus } from '@/types/user';
import { Plus } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';

// --- Helper: Transform Data ---
function transformUserData(profiles: any[]): User[] {
  return profiles.map((profile) => {
    // 1. Xử lý Role
    const roleDisplay: UserRole = profile.role === 'admin' ? 'Quản trị viên' : 'Học viên';
    
    // 2. Xử lý Display Info (Ưu tiên Email -> Username)
    const displayInfo = profile.email || (profile.username ? `${profile.username}` : 'Chưa cập nhật');
    
    // 3. Xử lý Tên hiển thị
    const displayName = profile.full_name || profile.username || 'Người dùng ẩn danh';

    return {
      id: profile.id,
      name: displayName,
      email: displayInfo,
      avatar: profile.avatar_url || '',
      role: roleDisplay,
      status: 'Hoạt động', // Có thể update logic status nếu DB có field này sau
    };
  });
}

export default async function UserManagementPage() {
  const supabase = await createClient();

  // 1. Lấy dữ liệu
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return <div className="p-6 text-red-500">Error loading users</div>;
  }

  // 2. Map dữ liệu (Sử dụng hàm helper)
  const formattedUsers = transformUserData(profiles || []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900"> Quản lý người dùng</h1>
          <p className="text-gray-500 mt-1">
            Xem, chỉnh sửa và quản lý quyền truy cập của tất cả thành viên.
          </p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
          <Plus className="w-5 h-5" />
          Thêm người dùng mới
        </button>
      </div>

      <UserClient initialUsers={formattedUsers} />
    </div>
  );
}