import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Học Tiếng Nga AI",
  description: "Hệ thống hỗ trợ giảng dạy và tự học tiếng Nga",
  manifest: "/manifest.json",
};

import NextTopLoader from 'nextjs-toploader';
import { getAuthUser } from "@/lib/actions/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <NextTopLoader color="#F28422" showSpinner={false} speed={200} />
        <Header initialUser={user} />
        {children}
        <Toaster position="top-center" richColors /> {/* <-- Thêm dòng này */}
        <Footer/>
      </body>
    </html>
  )
}