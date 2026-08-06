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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">

      {/* Main Content Area */}
      {/* Thêm flex-1 để phần nội dung chính đẩy Footer xuống dưới cùng nếu màn hình cao */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Form Card */}
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Card Header */}
          <div className="px-8 py-8 text-center flex flex-col items-center border-b border-gray-100">
            <div className="w-12 h-12 bg-orange-50 text-[#F28422] rounded-full flex items-center justify-center mb-4">
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#5B4A82] uppercase tracking-wide mb-2">
              Hỗ trợ giảng dạy và tự học<br />tiếng Nga
            </h1>
            <p className="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-black text-center mb-8 uppercase text-gray-900 tracking-tight">Đăng nhập</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-700">Email hoặc Tên đăng nhập</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            placeholder="example@email.com" 
                            {...field} 
                            className="pl-10 bg-white border-gray-200 h-11" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-700">Mật khẩu</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="pl-10 pr-10 bg-white border-gray-200 h-11"
                            />
                          </div>
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#5B4A82] hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#F28422] hover:bg-[#d9731b] text-white py-6 text-base font-bold uppercase transition-colors" 
                  disabled={isPending}
                >
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng nhập...</> : "Đăng nhập"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 p-5 text-center text-sm border-t border-gray-100">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link href="/register" className="text-[#F28422] font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
        {/* Lưu ý: Tôi đã xóa phần "Page Footer (Outside Card)" cũ để thay thế bằng Footer mới của bạn */}
      </main>
    </div>
  )
}