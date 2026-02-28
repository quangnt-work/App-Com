// src/app/(auth)/layout.tsx
import React from "react"
import { Header } from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? { 
    name: user.user_metadata?.full_name, 
    role: user.user_metadata?.role || 'student' 
  } : null

  return (
    // Bỏ thẻ <html> và <body> đi
    <div className="flex flex-col min-h-screen">
      <Header user={userData} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}