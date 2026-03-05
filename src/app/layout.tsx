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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userData = user ? { 
    name: String(user.user_metadata?.full_name || user.email), 
    role: String(user.user_metadata?.role || 'student') 
  } : null;

  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <Header user={userData} />
        {children}
        <Toaster position="top-center" richColors /> {/* <-- Thêm dòng này */}
        <Footer/>
      </body>
    </html>
  )
}