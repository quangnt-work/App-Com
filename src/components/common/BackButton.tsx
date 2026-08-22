'use client'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // Không hiển thị nút quay lại ở trang chủ Admin
  if (pathname === '/admin/dashboard' || pathname === '/') {
    return null
  }

  const handleBack = () => {
    // Xử lý các trang danh sách con của bài học
    if (pathname.match(/^\/admin\/lessons\/(videos|audios|grammars)$/)) {
      router.push('/admin/lessons')
      return
    }


    // Điều hướng thẳng về dashboard từ các danh sách chính
    if (
      pathname === '/admin/exams' ||
      pathname === '/admin/lessons' ||
      pathname === '/admin/users' ||
      pathname === '/admin/students' ||
      pathname === '/admin/materials'
    ) {
      router.push('/admin/dashboard')
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all font-bold text-sm group bg-transparent border-none p-0 focus:ring-0"
    >
      {/* Mũi tên thanh mảnh */}
      <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
      <span>Quay lại</span>
    </button>
  )
}