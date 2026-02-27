// app/(admin)/layout.tsx hoặc app/(student)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Chuyển đổi dữ liệu user phù hợp với HeaderProps
  const headerUser = user ? { name: user.email?.split('@test.qa') || '', role: 'Học Viên' } : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={headerUser} /> 
      <main>{children}</main>
    </div>
  )
}