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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 max-w-7xl pt-6 pb-2">
        <BackButton />
      </div>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}