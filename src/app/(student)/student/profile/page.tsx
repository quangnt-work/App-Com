import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
// Import các component con đã tách
import { UserInfoCard } from '@/components/student/profile/UserInfoCard'
import { CurrentLevelCard } from '@/components/student/profile/CurrentLevelCard'
import { CompetencyChart } from '@/components/student/profile/CompetencyChart'
import { HistorySection } from '@/components/student/profile/HistorySection'
import { SettingsSection } from '@/components/student/profile/SettingsSection'

export default async function UserProfile() {
  const supabase = await createClient()
  
  // 1. Lấy dữ liệu user
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Lấy dữ liệu profile từ DB
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // 3. Chuẩn bị dữ liệu hiển thị (Đã sửa lỗi Date)
  const userData = {
    fullName: profile?.full_name || 'Người dùng',
    username: profile?.username || 'user',
    email: user?.email || 'email@example.com',
    userId: user?.id || '',
    
    // === SỬA LỖI TẠI ĐÂY ===
    // Date.now() trả về số -> Sai kiểu string của interface
    // new Date().toISOString() trả về chuỗi "2023-10-25T..." -> Đúng
    joinDate: user?.created_at || new Date().toISOString()
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-sky-500">Trang chủ</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Hồ sơ cá nhân</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* === LEFT SIDEBAR === */}
        <div className="lg:col-span-3">
           <UserInfoCard 
              fullName={userData.fullName}
              username={userData.username}
              userId={userData.userId}
              joinDate={userData.joinDate}
           />
           <CurrentLevelCard />
        </div>

        {/* === RIGHT CONTENT === */}
        <div className="lg:col-span-9 space-y-6">
           <CompetencyChart />
           <HistorySection />
           <SettingsSection 
              email={userData.email} 
              fullName={userData.fullName} 
           />
        </div>
      </div>
    </div>
  )
}