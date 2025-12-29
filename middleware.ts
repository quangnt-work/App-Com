import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Khởi tạo Response mặc định
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Khởi tạo Supabase Client cho Middleware
  // Logic này giúp xử lý cookies để quản lý session an toàn
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

  // 3. Lấy thông tin User hiện tại
  // Hàm getUser() an toàn hơn getSession() vì nó xác thực lại với server Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- PHẦN LOGIC ĐIỀU HƯỚNG & PHÂN QUYỀN ---

  const path = request.nextUrl.pathname
  
  // Định nghĩa các route
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register')
  const isAdminRoute = path.startsWith('/admin')
  const isStudentRoute = path.startsWith('/learn') || path.startsWith('/student')

  // CASE A: User chưa đăng nhập (Khách)
  if (!user) {
    // Nếu cố vào trang Admin hoặc Student -> Đá về trang Login
    if (isAdminRoute || isStudentRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // (Optional) Lưu lại trang họ muốn vào để redirect lại sau khi login xong
      url.searchParams.set('next', path) 
      return NextResponse.redirect(url)
    }
  }

  // CASE B: User đã đăng nhập
  if (user) {
    // Lấy Role từ bảng 'users' (Dựa trên schema bạn đã thiết kế)
    // Lưu ý: Việc query DB trong middleware có thể làm chậm request nhẹ.
    // Giải pháp tối ưu hơn là lưu role vào User Metadata, nhưng ở đây ta dùng DB cho chắc chắn.
    
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
      
    const role = dbUser?.role || 'student' // Mặc định là student nếu không tìm thấy

    // 1. Đã login mà cố vào trang Login/Register -> Chuyển hướng vào trong
    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone()
      // Nếu là admin thì vào dashboard, học viên thì vào trang học
      redirectUrl.pathname = role === 'admin' ? '/admin/dashboard' : '/learn/my-courses'
      return NextResponse.redirect(redirectUrl)
    }

    // 2. Bảo vệ trang Admin (Chỉ Admin mới được vào)
    if (isAdminRoute && role !== 'admin') {
      // Học viên cố tình vào /admin -> Đá về trang học
      return NextResponse.redirect(new URL('/learn/my-courses', request.url))
    }

    // 3. (Tuỳ chọn) Admin có được vào trang học không? 
    // Thường là CÓ để kiểm tra hiển thị, nên không cần chặn chiều ngược lại.
  }

  return response
}

// Cấu hình Matcher để Middleware chỉ chạy trên các route cần thiết
// Bỏ qua các file tĩnh, ảnh, favicon để tối ưu hiệu năng
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs...)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}