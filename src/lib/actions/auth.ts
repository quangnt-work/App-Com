'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { LoginSchema, LoginInput, RegisterSchema, RegisterInput } from '../schemas/auth'

// ==========================================
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU & HELPER
// ==========================================

const generateInternalEmail = (identifier: string) => 
  identifier.includes('@') ? identifier : `${identifier}@test.qa`;

// Kiểu dữ liệu trả về của Server Action (dùng cho useFormState)
export type AuthState = {
  success: boolean;
  message: string;
  role?: string; // Optional vì khi lỗi sẽ không có role
} | undefined; // Undefined cho trạng thái ban đầu

// ==========================================
// 2. SERVER ACTION: SIGNUP
// ==========================================
export async function signup(data: RegisterInput) {
  const validatedFields = RegisterSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, message: "Dữ liệu không hợp lệ" }
  }

  const supabase = await createClient()
  const { fullName, username, password } = validatedFields.data

  const email = generateInternalEmail(username)

  const { data: authData, error } = await supabase.auth.signUp({
    email,
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

  // Yêu cầu Next.js revalidate lại layout để Header cập nhật thông tin user ngay lập tức
  revalidatePath('/', 'layout');

  return { success: true, message: 'Đăng ký thành công! Đang chuyển hướng...' }
}

// ==========================================
// 3. SERVER ACTION: LOGIN
// ==========================================
export async function login(data: LoginInput) {
  const validatedFields = LoginSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, message: "Dữ liệu không hợp lệ" }
  }
  const supabase = await createClient()
  const { identifier, password } = validatedFields.data;

  const email = generateInternalEmail(identifier)

  // A. Xác thực với Supabase Auth
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !authData.user) {
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' }
  }

  const user = authData.user;

  // C. Query bảng Profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profileError) {
    console.warn('⚠️ User chưa có profile trong bảng profiles, dùng role mặc định từ JWT.')
    
    const role = user.user_metadata?.role || 'student'
    if (user.user_metadata?.role !== 'student') {
      await supabase.auth.updateUser({ data: { role: 'student' } })
    }

    revalidatePath('/', 'layout');
    return { success: true, role: 'student', message: 'Đăng nhập thành công!' }
  }

  revalidatePath('/', 'layout');

  // 🔒 SECURITY FIX: Sync role từ DB vào JWT metadata
  // Middleware đọc role từ JWT (nhanh, không cần query DB thêm).
  // Nhưng JWT phải luôn đồng bộ với giá trị thực trong bảng profiles.
  // Giải quyết trường hợp: admin đổi role user trong DB nhưng JWT cũ vẫn có role cũ.
  if (user.user_metadata?.role !== profile.role) {
    await supabase.auth.updateUser({ data: { role: profile.role } })
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
  return { success: true }
}

// ==========================================
// 5. SERVER ACTION: GET CURRENT USER
// ==========================================
export async function getAuthUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    return {
      name: String(user.user_metadata?.full_name || user.email),
      role: String(user.user_metadata?.role || 'student')
    }
  } catch (error) {
    return null
  }
}