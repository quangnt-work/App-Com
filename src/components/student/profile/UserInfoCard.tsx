import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Pencil, LayoutDashboard, BookOpen, FileText, Calendar, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface UserInfoCardProps {
  fullName: string | null;
  username: string | null;
  userId: string;
  joinDate: string; // ISO String
}

// Hàm xử lý ngày tháng an toàn
function getYearFromDate(dateString: string): number {
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return new Date().getFullYear();
  }
}

export function UserInfoCard({ fullName, username, userId, joinDate }: UserInfoCardProps) {
  return (
    <>
      <Card className="p-6 flex flex-col items-center text-center bg-white shadow-sm border-slate-200 rounded-2xl">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md relative bg-slate-200">
          <Image src="/user-avatar.png" alt="Avatar" fill className="object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{fullName || 'Chưa cập nhật tên'}</h2>
        <p className="text-slate-500 text-sm mb-4">{username || 'user'}@email.com</p>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-6">
          <span>ID: {userId.slice(0, 8)}</span>
          <span>•</span>
          <span>Tham gia: {getYearFromDate(joinDate)}</span>
        </div>

        <div className="grid grid-cols-2 w-full gap-4 text-center border-t border-slate-100 pt-6">
          <div>
            <div className="font-bold text-2xl text-slate-900">12</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Khóa học</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-slate-900">45h</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Giờ học</div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-6 flex items-center gap-2 border-slate-200 hover:bg-slate-50">
          <Pencil className="h-4 w-4" /> Chỉnh sửa hồ sơ
        </Button>
      </Card>

      {/* Navigation Menu */}
      <Card className="p-2 bg-white shadow-sm border-slate-200 rounded-xl overflow-hidden mt-6">
        <nav className="flex flex-col">
          <SidebarLink icon={LayoutDashboard} label="Hồ sơ học tập" active />
          <SidebarLink icon={BookOpen} label="Tổng quan" />
          <SidebarLink icon={FileText} label="Khóa học của tôi" />
          <SidebarLink icon={Calendar} label="Lịch thi" />
        </nav>
      </Card>
    </>
  )
}

function SidebarLink({ icon: Icon, label, active }: { icon: LucideIcon, label: string, active?: boolean }) {
  return (
    <Link href="#" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
      <Icon className={`h-5 w-5 ${active ? 'text-sky-500' : 'text-slate-400'}`} />
      {label}
    </Link>
  )
}