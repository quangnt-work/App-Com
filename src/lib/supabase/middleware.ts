// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.type'


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
  const supabase = createServerClient<Database>(
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
  // 3. TỐI ƯU BẢO MẬT: Dùng getUser() thay vì getSession()
  // getUser() gửi request qua mạng để verify token với server (chống giả mạo JWT)
  // ==========================================
  const { data: { user } } = await supabase.auth.getUser()

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
    const isAdmin = role === 'admin' || role === 'ADMIN'

    // 1. Nếu đang ở trang Auth (Login/Register) -> Redirect về trang dashboard tương ứng
    if (path === protectedRoutes.login || path === protectedRoutes.register) {
      const url = request.nextUrl.clone()
      if (isAdmin) {
        url.pathname = '/admin/dashboard'
      } else {
        url.pathname = '/' // Trang chủ chứa danh sách các module lớn
      }
      return NextResponse.redirect(url)
    }

    if (path.startsWith(protectedRoutes.admin) && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Trả về trang chủ nếu không có quyền admin
      return NextResponse.redirect(url)
    }
  }

  return response
}