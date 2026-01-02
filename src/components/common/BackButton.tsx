'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => router.back()} 
      className="gap-1 text-slate-500 hover:text-slate-900 pl-0 hover:bg-transparent"
    >
      <ChevronLeft className="w-4 h-4" /> Quay lại
    </Button>
  )
}