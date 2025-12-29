import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Định nghĩa kiểu dữ liệu cho User Activity
interface RecentUser {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string;
}

export function RecentActivity({ users }: { users: RecentUser[] }) {
  return (
    <Card className="col-span-1 lg:col-span-4 border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Hoạt động gần đây</CardTitle>
        <p className="text-sm text-slate-500">Thành viên mới gia nhập hệ thống.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                  <AvatarFallback>{(user.full_name || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {user.full_name || 'Người dùng ẩn danh'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user.username || 'user'}@student.local
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-slate-400">
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-4">Chưa có hoạt động nào.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}