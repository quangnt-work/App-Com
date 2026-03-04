// app/(admin)/layout.tsx

import { BackButton } from "@/components/common/BackButton"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 max-w-7xl pt-6 pb-2">
              <BackButton />
            </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}