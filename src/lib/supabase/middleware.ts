// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Định nghĩa các Route cần bảo vệ
const protectedRoutes = {
  admin: '/admin',
  student: '/student', // hoặc các route học viên
  login: '/login',
  register: '/register',
}

export async function updateSession(request: NextRequest) {
  // 1. Khởi tạo response giữ nguyên header request
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Tạo Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ==========================================
  // 3. TỐI ƯU TỐC ĐỘ: Dùng getSession() thay vì getUser()
  // getSession() chỉ giải mã cookie cục bộ (0ms), không gửi request qua mạng
  // ==========================================
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  const path = request.nextUrl.pathname

  // --- LOGIC BẢO VỆ ROUTE & PHÂN QUYỀN ---

  // CASE A: Chưa đăng nhập
  if (!user) {
    // Nếu cố vào trang Admin hoặc Student -> Đá về Login
    if (path.startsWith(protectedRoutes.admin) || path.startsWith(protectedRoutes.student)) {
      const url = request.nextUrl.clone()
      url.pathname = protectedRoutes.login
      // (Optional) Lưu lại trang họ muốn vào để redirect lại sau khi login xong
      // url.searchParams.set('next', path) 
      return NextResponse.redirect(url)
    }
  }

  // CASE B: Đã đăng nhập
  if (user) {
    // Lấy Role từ user_metadata (đọc trực tiếp từ JWT Token siêu nhanh)
    const role = user.user_metadata?.role || 'student' // mặc định là student nếu không có role

    // 1. Nếu đang ở trang Auth (Login/Register) -> Redirect về trang dashboard tương ứng
    if (path === protectedRoutes.login || path === protectedRoutes.register) {
      const url = request.nextUrl.clone()
      if (role === 'admin' || role === 'ADMIN') {
        url.pathname = '/admin/dashboard'
      } else {
        url.pathname = '/' // Trang chủ chứa danh sách các module lớn
      }
      return NextResponse.redirect(url)
    }

    if (path.startsWith(protectedRoutes.admin) && role !== 'admin' && role !== 'ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Trả về trang chủ nếu không có quyền admin
      return NextResponse.redirect(url)
    }
  }

  return response
}