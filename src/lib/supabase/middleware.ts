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


  // 3. Lấy User (Hàm này tự động refresh token nếu cần)
  // LƯU Ý: Không được cache kết quả này
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
    // Lấy Role từ user_metadata (Giả sử bạn lưu role trong metadata khi đăng ký)
    // Hoặc query bảng profiles nếu role lưu ở bảng riêng (nhưng sẽ chậm hơn chút)
    const role = user.user_metadata?.role || 'student' // mặc định là student nếu không có role


    // 1. Nếu đang ở trang Auth (Login/Register) -> Redirect về trang dashboard tương ứng
    if (path === protectedRoutes.login || path === protectedRoutes.register) {
      const url = request.nextUrl.clone()
      if (role === 'admin' || role === 'ADMIN') {
        url.pathname = '/admin/dashboard'
      } else {
        url.pathname = '/student/lessons' // Hoặc trang chủ học viên
      }
      return NextResponse.redirect(url)
    }


    // 2. Bảo vệ trang Admin: Nếu không phải Admin mà cố vào /admin -> Đá về trang học viên
    if (path.startsWith(protectedRoutes.admin) && role !== 'admin' && role !== 'ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/student/lessons' // Hoặc trang 403 Forbidden
      return NextResponse.redirect(url)
    }
  }


  return response
}