import { Card } from '@/components/ui/card'
import { Users, BookOpen, FileText, Activity, type LucideIcon } from 'lucide-react'

// Định nghĩa Interface cho dữ liệu đầu vào
interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalResources: number; // Tổng Tài liệu + Đề thi
  totalPractice: number;  // Bài tập
}

interface StatItem {
  label: string;
  val: string;
  sub: string;
  color: string;
  icon: LucideIcon;
  bg: string;
}

export function StatsSection({ stats }: { stats: DashboardStats }) {
  // Mapping dữ liệu thật vào cấu trúc hiển thị
  const statItems: StatItem[] = [
    { 
      label: 'Tổng học viên', 
      val: stats.totalStudents.toString(), 
      sub: 'Thành viên Active', 
      color: 'text-emerald-500', 
      icon: Users, 
      bg: 'bg-sky-50' 
    },
    { 
      label: 'Tổng khóa học', 
      val: stats.totalCourses.toString(), 
      sub: 'Khóa học public', 
      color: 'text-blue-500', 
      icon: BookOpen, 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Kho tài nguyên', 
      val: stats.totalResources.toString(), 
      sub: 'Tài liệu & Đề thi', 
      color: 'text-purple-500', 
      icon: FileText, 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Ngân hàng bài tập', 
      val: stats.totalPractice.toString(), 
      sub: 'Câu hỏi luyện tập', 
      color: 'text-rose-500', 
      icon: Activity, 
      bg: 'bg-rose-50' 
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, idx) => (
        <Card key={idx} className="p-6 border border-slate-200 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-sm text-slate-500 mb-1 font-medium">{item.label}</p>
               <h3 className="text-3xl font-bold text-slate-900">{item.val}</h3>
             </div>
             <div className={`p-3 rounded-xl ${item.bg}`}>
               <item.icon className={`h-6 w-6 ${item.color.replace('text-', 'text-opacity-80 ')}`} />
             </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-xs font-bold ${item.color} bg-slate-50 px-2 py-1 rounded`}>
              {item.sub}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}