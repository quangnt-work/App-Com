import { Header } from '@/components/layout/Header' // Tận dụng Header trang chủ hoặc tạo Header riêng cho Student

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar dùng chung cho toàn bộ khu vực Student */}
      <Header /> 
      
      {/* Nội dung thay đổi (Profile, Course, Lesson...) */}
      <main className="pt-4">
        {children}
      </main>
    </div>
  )
}