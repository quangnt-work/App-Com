// src/app/(auth)/login/page.tsx
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions/auth" 
import { LoginSchema, LoginInput } from "@/lib/schemas/auth" 

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff, Loader2, User, Lock, GraduationCap } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Header } from "@/components/layout/Header" // Import Header
import { Footer } from "@/components/layout/Footer" // Import Footer mới của bạn

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: "", password: "" },
  })

  const onSubmit = (values: LoginInput) => {
    startTransition(async () => {
      try {
        const result = await login(values)

        if (result.success) {
          toast.success(result.message)
          const redirectUrl = result.role === 'admin' ? '/admin/dashboard' : '/'
          router.refresh()
          router.replace(redirectUrl)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
      }
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
      {/* Cột trái: Russian Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-10 flex-col justify-between overflow-hidden text-white select-none">
        {/* Decorative background glow & Cyrillic accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Floating Cyrillic typography watermark */}
        <div className="absolute inset-0 flex flex-col justify-around items-center opacity-5 pointer-events-none font-serif text-8xl font-black">
          <div className="translate-x-12">РУССКИЙ</div>
          <div className="-translate-x-16">ЯЗЫК</div>
          <div className="translate-x-20">ЗНАНИЕ</div>
        </div>

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
            <span className="text-sm font-black tracking-wider text-white">RU·LEARN</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-blue-200/80 font-semibold">Cổng Học Tiếng Nga</span>
        </div>

        {/* Center message & quote */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Học tập đa nền tảng
          </div>
          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-snug mb-3">
            Học tiếng Nga trực quan cùng AI & Giảng viên
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hệ thống bài giảng ngữ pháp chuẩn hóa, luyện nghe, xem video thực tế kết hợp trợ lý luyện phát âm và giao tiếp phản xạ.
          </p>
        </div>

        {/* Bottom footer credit */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Giảng viên: Thượng úy Phạm Quang Anh</span>
          <span className="text-slate-500">Khoa Cơ bản - Cơ sở</span>
        </div>
      </div>

      {/* Cột phải: Form Card Compact */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
          
          {/* Card Header Compact */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2.5 shadow-inner">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
              Đăng nhập tài khoản
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Chào mừng bạn quay trở lại học tập</p>
          </div>

          {/* Card Body Compact */}
          <div className="px-6 py-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700">Email hoặc Tên đăng nhập</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <Input 
                            placeholder="username hoặc example@email.com" 
                            {...field} 
                            className="pl-9 bg-slate-50/50 border-slate-200 h-9.5 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-slate-800" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold text-slate-700">Mật khẩu</FormLabel>
                        <Link href="/forgot-password" tabIndex={-1} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="pl-9 pr-9 bg-slate-50/50 border-slate-200 h-9.5 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                            />
                          </div>
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-10 text-sm font-bold uppercase shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all mt-2" 
                  disabled={isPending}
                >
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : "Đăng nhập"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Card Footer Compact */}
          <div className="bg-slate-50/80 px-6 py-3 text-center text-xs border-t border-slate-100">
            <span className="text-slate-500">Chưa có tài khoản? </span>
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}