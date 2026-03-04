import { createClient } from '@/lib/supabase/server'
import { AdminBanner } from '@/components/admin/dashboard/AdminBanner'
import { AdminStatsSection } from '@/components/admin/dashboard/AdminStatsSection'

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: studentCount },
    { count: grammarCount },
    { count: docCount },
    { count: examCount },
    { count: practiceCount },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }),
    supabase.from('documents').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('practice_exercises').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('id, full_name, username, avatar_url, created_at, role').order('created_at', { ascending: false }).limit(5)
  ])

  return {
    stats: {
      totalStudents: studentCount || 0,
      totalGrammars: grammarCount || 0,
      totalResources: (docCount || 0) + (examCount || 0),
      totalPractice: practiceCount || 0,
    },
    recentUsers: recentUsers || []
  }
}

export default async function AdminDashboard() {
  const { stats, recentUsers } = await getDashboardStats()

  return (
    <div className="p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* 2. Banner cam mới */}
        <AdminBanner />

        {/* 3. Thống kê Card mới */}
        <AdminStatsSection stats={stats} />

        {/* 4. Các block cũ giữ nguyên ở dưới (Hoạt động gần đây & Menu) */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mt-8">
          <RecentActivity users={recentUsers} />
          <div className="lg:col-span-3">
             <ManagementSection /> 
          </div>
        </div> */}
        
      </div>
    </div>
  )
}