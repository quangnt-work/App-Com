import { createClient } from '@/lib/supabase/server';
import UserClient from './UserClient';
import { User, UserRole, UserStatus } from '@/types/user';
import { Plus } from 'lucide-react';

export default async function UserManagementPage() {
  const supabase = await createClient();

  // 1. Lấy dữ liệu (đảm bảo select đủ các trường cần thiết)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*') // Lấy tất cả, bao gồm username, full_name, role...
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading users</div>;
  }

  // 2. LOGIC QUAN TRỌNG: Map dữ liệu
  const formattedUsers: User[] = (profiles || []).map((profile) => {
    // Xử lý Role
    let roleDisplay: UserRole = 'Học viên';
    if (profile.role === 'admin') roleDisplay = 'Quản trị viên';
    
    // Xử lý Status (Tạm thời default, hoặc check field nếu có)
    const statusDisplay: UserStatus = 'Hoạt động'; 

    // --- LOGIC HIỂN THỊ EMAIL HOẶC USERNAME ---
    // Ưu tiên 1: Email (nếu cột email tồn tại trong profiles)
    // Ưu tiên 2: Username (nếu không có email)
    // Ưu tiên 3: Chuỗi mặc định
    const displayInfo = profile.email 
      ? profile.email 
      : (profile.username ? `${profile.username}` : 'Chưa cập nhật');

    // Xử lý Tên hiển thị (fallback về username nếu không có full_name)
    const displayName = profile.full_name || profile.username || 'Người dùng ẩn danh';

    return {
      id: profile.id,
      name: displayName,
      email: displayInfo, // Truyền username/email vào biến này để UI hiển thị
      avatar: profile.avatar_url || '',
      role: roleDisplay,
      status: statusDisplay,
    };
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
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