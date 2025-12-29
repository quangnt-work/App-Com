// src/components/admin/dashboard/ManagementSection.tsx
import { Users, BookOpen, Activity, Settings, FileText, HelpCircle } from 'lucide-react'
import { ManageCard } from './ManageCard'

export function ManagementSection() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-sky-500" />
        Phím tắt quản lý
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
         {/* QUAN TRỌNG: Thêm href="/admin/users" vào đây */}
         <ManageCard 
            icon={Users} 
            title="Người dùng" 
            desc="Quản lý tài khoản" 
            href="/admin/users" 
         />

         {/* Các mục khác bạn có thể để tạm href="#" hoặc đường dẫn tương ứng sau này */}
         <ManageCard icon={BookOpen} title="Khóa học" desc="Tạo bài giảng" href="/admin/courses" />
         <ManageCard icon={HelpCircle} title="Đề thi" desc="Soạn câu hỏi" href="/admin/exams" />
         <ManageCard icon={FileText} title="Tài liệu" desc="Upload file" href="/admin/documents" />
         <ManageCard icon={Activity} title="Báo cáo" desc="Xem thống kê" href="/admin/reports" />
         <ManageCard icon={Settings} title="Cấu hình" desc="Cài đặt chung" href="/admin/settings" />
      </div>
    </div>
  )
}