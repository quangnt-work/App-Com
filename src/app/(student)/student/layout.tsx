import React from "react"
import Image from "next/image"
import { createClient } from '@/lib/supabase/server'
import { BackButton } from "@/components/common/BackButton"
import { Footer } from "@/components/layout/Footer"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative font-sans">
      {/* Nền phong cảnh Nga hiển thị xuyên suốt nhưng được làm mờ (blur) theo yêu cầu */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/bg.jpg"
          alt="Phong cảnh nước Nga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter blur-[8px]"
          quality={85}
        />
        {/* Lớp phủ mỏng nhẹ giúp giữ trọn vẹn cảnh sắc nước Nga nhưng dịu mắt khi đọc văn bản */}
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Nội dung các màn hình học viên */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <div className="container mx-auto px-4 max-w-6xl pt-2 sm:pt-2.5 pb-1">
          <BackButton />
        </div>
        
        <div className="flex-1 pb-2 sm:pb-3 flex flex-col min-h-0">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  )
}