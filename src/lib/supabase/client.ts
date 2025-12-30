import { createBrowserClient } from '@supabase/ssr'
// Import Type nếu bạn đã tạo ở bước trước (Optional nhưng khuyên dùng)
import { Database } from '@/types/supabase' 

export function createClient() {
  // Client-side client tự động xử lý cookie trong trình duyệt
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}