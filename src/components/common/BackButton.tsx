'use client'
import { useRouter, usePathname } from 'next/navigation' // Thêm usePathname
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronLeftCircle } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname() // Lấy đường dẫn hiện tại

  // Nếu đang ở trang chủ, trả về null (không hiển thị gì cả)
  if (pathname === '/') {
    return null;
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 pt-4"> {/* Wrapper để căn lề đẹp */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.back()} 
        className="text-slate-500 hover:text-slate-900 pl-0 hover:bg-transparent"
      >
        <ChevronLeftCircle className="w-4 h-4" /> Quay lại
      </Button>
    </div>
  )
}