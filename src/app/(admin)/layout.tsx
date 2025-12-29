// app/(admin)/layout.tsx
import { Header } from '@/components/layout/Header' // Sử dụng Header mới

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header /> {/* Header này đã có nút đăng xuất */}
      <main>{children}</main>
    </div>
  )
}