import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Bell, LogOut, HelpCircle, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import Image from 'next/image'

// 1. Định nghĩa danh sách Link để dễ quản lý
const ADMIN_LINKS = [
  { label: 'Tổng quan', href: '/admin/dashboard' },
  { label: 'Học viên', href: '/admin/users' },
  { label: 'Khóa học', href: '/admin/courses' },
  { label: 'Luyện tập', href: '/admin/practice' },
  { label: 'Kiểm tra', href: '/admin/exams' },
  { label: 'Tài liệu', href: '/admin/documents' },
]

const STUDENT_LINKS = [
  { label: 'Khóa học', href: '/student/courses' }, // Trang danh sách khóa học
  { label: 'Luyện tập', href: '/student/practice' },
  { label: 'Kiểm tra', href: '/student/exams' },
  { label: 'Tài liệu', href: '/student/documents' },
]

// Component nút Đăng xuất
function SignOutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-500" title="Đăng xuất">
        <LogOut className="h-5 w-5" />
      </button>
    </form>
  )
}

export async function Header() {
  const supabase = await createClient()
  
  // Lấy User và Profile
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const role = profile?.role || 'guest'

  // Logic xác định Logo sẽ dẫn về đâu
  const logoHref = role === 'admin' 
    ? '/admin/dashboard' 
    : (role === 'student' ? '/student/courses' : '/')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* === LOGO & NAVIGATION === */}
        <div className="flex items-center gap-8">
            <Link href={logoHref} className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <BookOpen className="h-7 w-7 text-sky-500" />
              <span className="hidden md:inline-block">E-Learning {role === 'admin' ? 'Admin' : 'Hub'}</span>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              {/* MENU ADMIN */}
              {role === 'admin' && ADMIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-sky-500 transition-colors">
                  {link.label}
                </Link>
              ))}

              {/* MENU HỌC VIÊN & KHÁCH */}
              {/* Nếu là khách, vẫn hiện menu nhưng bấm vào sẽ về Login */}
              {role !== 'admin' && STUDENT_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  // Logic: Nếu đã login -> Vào trang thật. Nếu chưa -> Vào trang Login
                  href={user ? link.href : '/login'} 
                  className="hover:text-sky-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
        </div>

        {/* === RIGHT SECTION (Search & Auth) === */}
        <div className="flex items-center gap-4">
           {/* Search Bar */}
           <div className="hidden lg:flex relative">
             <input 
                type="text" 
                placeholder="Tìm kiếm khóa học..." 
                className="pl-10 pr-4 py-2 rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64 transition-all" 
             />
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>

           {/* Auth State */}
           {user ? (
             <div className="flex items-center gap-3 border-l pl-4 ml-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                
                {role === 'admin' && (
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Trợ giúp">
                        <HelpCircle className="h-5 w-5 text-slate-600" />
                    </button>
                )}
                
                {/* User Dropdown/Info */}
                <Link href={role === 'admin' ? '/admin/dashboard' : '/student/profile'} className="flex items-center gap-3 hover:bg-slate-50 rounded-full pl-2 pr-1 py-1 transition-colors">
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-bold leading-none">{profile?.full_name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 capitalize mt-1">{role === 'admin' ? 'Quản trị viên' : 'Học viên'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 relative bg-slate-100">
                         {/* Nếu có avatar thì hiện, không thì hiện icon default */}
                         {profile?.avatar_url ? (
                            <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <UserIcon className="h-5 w-5" />
                            </div>
                         )}
                    </div>
                </Link>

                <SignOutButton />
             </div>
           ) : (
             <div className="flex items-center gap-3">
                <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-sky-500">
                    Đăng nhập
                </Link>
                <Link href="/register">
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 shadow-md shadow-sky-200">
                    Đăng ký
                    </Button>
                </Link>
             </div>
           )}
        </div>
      </div>
    </header>
  )
}