import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader'
import { StatsSection } from '@/components/admin/dashboard/StatsSection'
import { ManagementSection } from '@/components/admin/dashboard/ManagementSection'
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity'

// Hàm lấy thống kê tổng quan
async function getDashboardStats() {
  const supabase = await createClient()

  // Sử dụng Promise.all để chạy các query song song -> Tăng tốc độ
  const [
    { count: studentCount },
    { count: courseCount },
    { count: docCount },
    { count: examCount },
    { count: practiceCount },
    { data: recentUsers }
  ] = await Promise.all([
    // 1. Đếm Student
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    
    // 2. Đếm Khóa học
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    
    // 3. Đếm Tài liệu
    supabase.from('documents').select('*', { count: 'exact', head: true }),
    
    // 4. Đếm Đề thi
    supabase.from('exams').select('*', { count: 'exact', head: true }),

    // 5. Đếm Bài tập
    supabase.from('practice_exercises').select('*', { count: 'exact', head: true }),

    // 6. Lấy 5 user mới nhất
    supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, created_at, role')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return {
    stats: {
      totalStudents: studentCount || 0,
      totalCourses: courseCount || 0,
      totalResources: (docCount || 0) + (examCount || 0),
      totalPractice: practiceCount || 0,
    },
    recentUsers: recentUsers || []
  }
}

export default async function AdminDashboard() {
  // Fetch dữ liệu Server Side
  const { stats, recentUsers } = await getDashboardStats()

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-8">
      {/* 1. Header */}
      <DashboardHeader />

      {/* 2. Thống kê số liệu thật */}
      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* 3. Hoạt động gần đây (Chiếm 4 cột) */}
        <RecentActivity users={recentUsers} />
        
        {/* 4. Menu chức năng quản lý (Chiếm 3 cột - Layout Grid) */}
        <div className="lg:col-span-3">
             {/* Lưu ý: ManagementSection cần sửa nhẹ lại Grid class nếu muốn khớp layout 2 cột ở đây */}
             <ManagementSection /> 
        </div>
      </div>
    </div>
  )
}