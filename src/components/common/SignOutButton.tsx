'use client'
import { logout } from '@/lib/actions/auth'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <Button 
      onClick={async () => {
        await logout()
        window.location.href = '/'
      }} 
      variant="destructive" 
      size="sm" 
      className="gap-2"
    >
      <LogOut className="h-4 w-4" /> Đăng xuất
    </Button>
  )
}