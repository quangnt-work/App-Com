// src/app/(auth)/layout.tsx
import React from "react"
import Image from "next/image"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      {/* Nền phong cảnh Nga làm mờ xuyên suốt */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/bg.jpg"
          alt="Phong cảnh nước Nga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter blur-[8px]"
          quality={85}
        />
        <div className="absolute inset-0 bg-slate-900/30" />
      </div>

      <div className="relative z-10 flex-1">
        {children}
      </div>
    </div>
  )
}