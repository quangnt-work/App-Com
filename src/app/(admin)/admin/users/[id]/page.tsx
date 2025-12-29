import { createClient } from '@/lib/supabase/server'
import GradingView, { Submission, StudentProfile } from './GradingView'
import { notFound } from 'next/navigation'

// 1. Định nghĩa Type cho Params là Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserGradingPage({ params }: PageProps) {
  // 2. PHẢI AWAIT params trước khi dùng
  const { id } = await params;
  const userId = id;

  const supabase = await createClient()

  // 3. Fetch thông tin user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // Log lỗi nếu có để dễ debug (check xem terminal hiện gì nếu vẫn 404)
  if (profileError) {
    console.error("Lỗi lấy profile:", profileError);
  }

  // Nếu không tìm thấy profile, trả về 404
  if (!profile) {
    return notFound();
  }

  // 4. Fetch danh sách bài nộp
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })

  // 5. Map data
  const studentData: StudentProfile = {
    id: profile.id,
    name: profile.full_name || profile.username || 'No Name',
    email: profile.email || 'N/A', // Nếu bảng profiles chưa có email, dòng này sẽ hiện N/A
    avatar: profile.avatar_url || 'https://i.pravatar.cc/150', // Placeholder nếu không có avatar
    class_name: 'Frontend Master',
    gpa: 8.5
  }

  // Ép kiểu an toàn
  const subData: Submission[] = (submissions || []).map(sub => ({
    ...sub,
    status: sub.status as 'pending' | 'graded' | 'late' // Type assertion an toàn
  }))

  return <GradingView student={studentData} submissions={subData} />
}