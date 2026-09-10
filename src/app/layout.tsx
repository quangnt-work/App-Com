import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { Header } from "@/components/layout/Header";
import { getAuthUser } from "@/lib/actions/auth";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Học Tiếng Nga AI",
  description: "Hệ thống hỗ trợ giảng dạy và tự học tiếng Nga",
  manifest: "/manifest.json",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  return (
    <html lang="vi" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextTopLoader color="#3B82F6" showSpinner={false} speed={200} />
        <Header initialUser={user} />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}