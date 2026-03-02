// app/(admin)/layout.tsx

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>{children}</main>
    </div>
  )
}