import { Users, BookOpen, Activity, Settings, FileText, HelpCircle } from 'lucide-react'
import { ManageCard } from './ManageCard'

export function ManagementSection() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-sky-500" />
        Phím tắt quản lý
      </h2>
      {/* Chuyển thành 1 cột hoặc 2 cột tùy độ rộng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
         <ManageCard icon={Users} title="Người dùng" desc="Quản lý tài khoản" />
         <ManageCard icon={BookOpen} title="Khóa học" desc="Tạo bài giảng" />
         <ManageCard icon={HelpCircle} title="Đề thi" desc="Soạn câu hỏi" />
         <ManageCard icon={FileText} title="Tài liệu" desc="Upload file" />
         <ManageCard icon={Activity} title="Báo cáo" desc="Xem thống kê" />
         <ManageCard icon={Settings} title="Cấu hình" desc="Cài đặt chung" />
      </div>
    </div>
  )
}