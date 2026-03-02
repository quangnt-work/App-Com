'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all font-bold text-sm group bg-transparent border-none p-0 focus:ring-0"
    >
      {/* Mũi tên thanh mảnh */}
      <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
      <span>Quay lại</span>
    </button>
  )
}