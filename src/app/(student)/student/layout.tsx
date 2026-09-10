import React from "react"
import { createClient } from '@/lib/supabase/server'
import { BackButton } from "@/components/common/BackButton"
import { Footer } from "@/components/layout/Footer"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const userData = user ? { 
    name: user.user_metadata?.full_name, 
    role: user.user_metadata?.role || 'student' 
  } : null

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-7xl pt-3 pb-1">
        <BackButton />
      </div>
      
      <div className="flex-1 pb-6">
        {children}
      </div>

      <Footer />
    </div>
  )
}