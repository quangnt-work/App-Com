'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * Xác định chính xác trang cha (Parent Route) theo phân cấp kiến trúc thông tin của ứng dụng.
 * Quy tắc: Bấm "Quay lại" luôn đưa người dùng lên 1 cấp thư mục cha cố định,
 * thay vì phụ thuộc vào lịch sử ngẫu nhiên của trình duyệt (tránh vòng lặp chi tiết <-> danh sách).
 */
export function getParentRoute(pathname: string): string | null {
  // Không hiển thị nút quay lại ở trang chủ và dashboard quản trị
  if (pathname === '/' || pathname === '/admin/dashboard') {
    return null
  }

  // -------------------------------------------------------------
  // 1. PHÂN CẤP CÁC TRANG HỌC VIÊN (STUDENT)
  // -------------------------------------------------------------

  // Menu cấp 1 -> Quay về Trang chủ ('/')
  if (
    pathname === '/student/lessons' ||
    pathname === '/student/ai' ||
    pathname === '/student/exams' ||
    pathname === '/student/documents' ||
    pathname === '/student/profile'
  ) {
    return '/'
  }

  // === BÀI HỌC (LESSONS) ===
  // Phân mục bài học -> Quay về Hub bài học (/student/lessons)
  if (
    pathname === '/student/lessons/videos' ||
    pathname === '/student/lessons/audios' ||
    pathname === '/student/lessons/grammars'
  ) {
    return '/student/lessons'
  }
  // Chi tiết bài học -> Quay về danh sách tương ứng
  if (pathname.startsWith('/student/lessons/videos/')) {
    return '/student/lessons/videos'
  }
  if (pathname.startsWith('/student/lessons/audios/')) {
    return '/student/lessons/audios'
  }
  if (pathname.startsWith('/student/lessons/grammars/')) {
    return '/student/lessons/grammars'
  }

  // === TRÍ TUỆ NHÂN TẠO (AI STUDIO) ===
  // Các tính năng AI con -> Quay về AI Hub (/student/ai)
  if (
    pathname === '/student/ai/chat' ||
    pathname === '/student/ai/grammar' ||
    pathname === '/student/ai/dictionary' ||
    pathname === '/student/ai/speaking' ||
    pathname === '/student/ai/shadowing' ||
    pathname === '/student/ai/roleplay' ||
    pathname === '/student/ai/immersive' ||
    pathname === '/student/ai/immersive/roleplay' ||
    pathname === '/student/ai/immersive/shadowing'
  ) {
    return '/student/ai'
  }

  // Chi tiết hội thoại AI -> Quay về danh sách chủ đề chat
  if (pathname.startsWith('/student/ai/chat/')) {
    return '/student/ai/chat'
  }

  // Chi tiết trắc nghiệm ngữ pháp AI -> Quay về danh sách chủ đề ngữ pháp
  if (pathname.startsWith('/student/ai/grammar/')) {
    return '/student/ai/grammar'
  }

  // Chi tiết từ điển chuyên ngành -> Quay về danh sách chủ đề từ điển
  if (pathname.startsWith('/student/ai/dictionary/')) {
    return '/student/ai/dictionary'
  }

  // Luyện nói (Speaking):
  // Cấp 3: Luyện từ vựng / Luyện mẫu câu -> Quay về màn chọn hình thức (/student/ai/speaking/[topicSlug])
  const speakingSubMatch = pathname.match(/^\/student\/ai\/speaking\/([^/]+)\/(vocabulary|sentences)$/)
  if (speakingSubMatch) {
    return `/student/ai/speaking/${speakingSubMatch[1]}`
  }
  // Cấp 2: Màn chọn hình thức luyện tập -> Quay về danh sách chủ đề nói (/student/ai/speaking)
  if (pathname.startsWith('/student/ai/speaking/')) {
    return '/student/ai/speaking'
  }

  // Roleplay & Shadowing trực tiếp:
  if (pathname.startsWith('/student/ai/roleplay/')) {
    return '/student/ai/roleplay'
  }
  if (pathname.startsWith('/student/ai/shadowing/')) {
    return '/student/ai/shadowing'
  }

  // Fallback Immersive cũ:
  if (pathname.startsWith('/student/ai/immersive/roleplay/')) {
    return '/student/ai/roleplay'
  }
  if (pathname.startsWith('/student/ai/immersive/shadowing/')) {
    return '/student/ai/shadowing'
  }

  // === BÀI THI / KIỂM TRA (EXAMS) ===
  // Màn làm bài kiểm tra chi tiết -> Luôn quay về danh sách bài kiểm tra
  if (pathname.startsWith('/student/exams/')) {
    return '/student/exams'
  }

  // -------------------------------------------------------------
  // 2. PHÂN CẤP CÁC TRANG QUẢN TRỊ (ADMIN)
  // -------------------------------------------------------------

  // Menu cấp 1 Admin -> Quay về Dashboard Admin
  if (
    pathname === '/admin/exams' ||
    pathname === '/admin/lessons' ||
    pathname === '/admin/users' ||
    pathname === '/admin/students' ||
    pathname === '/admin/materials' ||
    pathname === '/admin/ai' ||
    pathname === '/admin/shadowing' ||
    pathname === '/admin/roleplay'
  ) {
    return '/admin/dashboard'
  }

  // Admin bài học:
  if (
    pathname === '/admin/lessons/videos' ||
    pathname === '/admin/lessons/audios' ||
    pathname === '/admin/lessons/grammars'
  ) {
    return '/admin/lessons'
  }
  if (pathname.startsWith('/admin/lessons/videos/')) {
    return '/admin/lessons/videos'
  }
  if (pathname.startsWith('/admin/lessons/audios/')) {
    return '/admin/lessons/audios'
  }
  if (pathname.startsWith('/admin/lessons/grammars/')) {
    return '/admin/lessons/grammars'
  }

  // Admin đề thi tạo mới hoặc sửa chi tiết:
  if (pathname.startsWith('/admin/exams/')) {
    return '/admin/exams'
  }

  // Admin học viên chi tiết:
  if (pathname.startsWith('/admin/students/')) {
    return '/admin/students'
  }

  // Fallback an toàn: Cắt bỏ segment cuối cùng của URL
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 1) {
    return '/' + segments.slice(0, -1).join('/')
  }

  return '/'
}

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  const parentRoute = getParentRoute(pathname)

  // Không hiển thị nút quay lại nếu không có trang cha (Trang chủ / Admin Dashboard)
  if (!parentRoute) {
    return null
  }

  const handleBack = () => {
    // Trường hợp đặc biệt: Đang trong màn làm bài kiểm tra của học viên
    if (pathname.match(/^\/student\/exams\/[^\/]+$/)) {
      const isExamDone = typeof window !== 'undefined' && (window as any).__isExamFinished
      if (isExamDone) {
        router.push('/student/exams')
        return
      }
      if (window.confirm('Bạn có chắc chắn muốn thoát khỏi bài kiểm tra? Tiến trình làm bài chưa nộp sẽ không được lưu.')) {
        router.push('/student/exams')
      }
      return
    }

    // Điều hướng phân cấp xác định (không dùng router.back() để tránh vòng lặp lịch sử)
    router.push(parentRoute)
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700 transition-all font-bold text-xs sm:text-sm group bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-blue-300 focus:outline-none"
      title={`Quay lại ${parentRoute}`}
    >
      <ArrowLeft size={16} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1 text-slate-500 group-hover:text-blue-600" />
      <span>Quay lại</span>
    </button>
  )
}