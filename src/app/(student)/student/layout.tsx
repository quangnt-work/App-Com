// src/app/(student)/student/layout.tsx
import React from "react"
import { createClient } from '@/lib/supabase/server'
import { BackButton } from "@/components/common/BackButton"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? { 
    name: user.user_metadata?.full_name, 
    role: user.user_metadata?.role || 'student' 
  } : null

  return (
    // Bỏ thẻ <html> và <body> đi
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <BackButton />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}