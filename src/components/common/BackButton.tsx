'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    // Loại bỏ mọi màu nền (bg-transparent) để đồng nhất với màu nền trang
    <div className="w-full bg-transparent"> 
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#5B4A82] hover:text-[#4a3c6b] transition-all font-bold text-sm group bg-transparent border-none p-0 focus:ring-0"
        >
          {/* Mũi tên thanh mảnh, màu tím đồng bộ với tiêu đề */}
          <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
          <span>Quay lại</span>
        </button>
      </div>
    </div>
  )
}