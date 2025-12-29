'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ==========================================
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES)
// ==========================================

// Kiểu dữ liệu form đăng ký gửi lên
export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

// Kiểu dữ liệu trả về của Server Action (dùng cho useFormState)
export type AuthState = {
  success: boolean;
  message: string;
  role?: string; // Optional vì khi lỗi sẽ không có role
} | undefined; // Undefined cho trạng thái ban đầu

// ==========================================
// 2. SERVER ACTION: SIGNUP
// ==========================================
export async function signup(data: SignupData): Promise<AuthState> {
  const supabase = await createClient()
  const { fullName, username, password } = data
  
  // Tạo email giả định
  const fakeEmail = `${username}@student.local`

  const { error } = await supabase.auth.signUp({
    email: fakeEmail,
    password: password,
    options: {
      data: {
        full_name: fullName,
        username: username,
        role: 'student', 
      },
    },
  })

  if (error) {
    console.error('Signup error:', error)
    return { success: false, message: 'Username này đã được sử dụng hoặc không hợp lệ.' }
  }

  return { success: true, message: 'Đăng ký thành công! Đang chuyển hướng...' }
}

// ==========================================
// 3. SERVER ACTION: LOGIN
// ==========================================
export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  // Logic: Nếu không có @ thì tự thêm đuôi email
  let email = identifier
  if (!identifier.includes('@')) {
    email = `${identifier}@student.local`
  }

  // A. Xác thực với Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' }
  }

  // B. Lấy thông tin User để check Role & Self-Healing
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, message: 'Lỗi hệ thống: Không lấy được thông tin người dùng.' }
  }

  // C. Query bảng Profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // === SELF-HEALING LOGIC (TỰ SỬA LỖI) ===
  // Nếu Login thành công nhưng chưa có Profile (do lỗi lúc Signup cũ) -> Tạo ngay
  if (!profile || profileError) {
    console.log('⚠️ Phát hiện user chưa có profile, đang tự động tạo...')
    
    // Lấy thông tin từ metadata
    const metaName = user.user_metadata.full_name || 'Người dùng mới'
    const metaUsername = user.user_metadata.username || identifier.split('@')[0]

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: metaName,
        username: metaUsername,
        role: 'student' // Mặc định role là student
      })
    
    if (insertError) {
      console.error('❌ Lỗi Self-healing:', insertError)
      return { success: false, message: 'Lỗi: Không thể khởi tạo hồ sơ người dùng.' }
    }
    
    // Tạo xong thì trả về role mặc định
    return { success: true, role: 'student', message: 'Đăng nhập thành công!' }
  }

  // D. Nếu mọi thứ OK -> Trả về role từ DB
  return { success: true, role: profile.role, message: 'Đăng nhập thành công!' }
}

// ==========================================
// 4. SERVER ACTION: LOGOUT
// ==========================================
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}