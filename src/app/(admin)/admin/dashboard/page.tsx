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
    { count: grammarFileCount },
    { count: audioCount },
    { count: videoCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }),
    supabase.from('documents').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('practice_exercises').select('*', { count: 'exact', head: true }),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'file'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'audio'),
    supabase.from('grammars').select('*', { count: 'exact', head: true }).eq('type', 'video'),
  ])

  return {
    stats: {
      totalStudents: studentCount || 0,
      totalGrammars: grammarCount || 0,
      totalResources: (docCount || 0) + (examCount || 0),
      totalPractice: practiceCount || 0,
      grammarFileCount: grammarFileCount || 0,
      audioCount: audioCount || 0,
      videoCount: videoCount || 0,
    },
  }
}

export default async function AdminDashboard() {
  const { stats } = await getDashboardStats()

  return (
    <div className="p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Banner */}
        <AdminBanner />

        {/* Thống kê Card */}
        <AdminStatsSection stats={stats} />
      </div>
    </div>
  )
}
