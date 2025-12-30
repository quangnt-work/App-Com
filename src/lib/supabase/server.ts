import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  // 1. Phải await cookies() trước
  const cookieStore = await cookies()

  // 2. Trả về Supabase Client
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Sử dụng getAll() thay vì get() để lấy toàn bộ cookies
        getAll() {
          return cookieStore.getAll()
        },
        // setAll() xử lý cả việc tạo mới và xóa cookie
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Lỗi này xảy ra nếu bạn gọi set cookie từ Server Component (chỉ được phép đọc).
            // Middleware sẽ xử lý việc ghi cookie, nên ta có thể bỏ qua lỗi này ở đây.
          }
        },
      },
    }
  )
}