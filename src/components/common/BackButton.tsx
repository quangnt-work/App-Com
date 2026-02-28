// src/components/common/BackButton.tsx
'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#5B4A82] hover:text-[#4a3c6b] transition-all font-bold text-sm group"
      >
        {/* Mũi tên thanh mảnh giống trong ảnh */}
        <ArrowLeft size={20} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
        <span>Quay lại</span>
      </button>
    </div>
  )
}