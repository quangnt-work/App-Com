// src/app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signup } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button" // Đã chỉnh lại đường dẫn import cho ngắn gọn
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, User, Lock, EyeOff, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { RegisterSchema, RegisterInput } from "@/lib/schemas/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // States để ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { fullName: "", username: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true)
    try {
      const result = await signup(values)
      
      if (result.success) {
        toast.success(result.message)
        router.replace('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Lỗi kết nối, vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Form Card */}
        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative">
          
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

          <div className="px-8 pt-10 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Đăng ký tài khoản</h1>
              <p className="text-slate-500 text-sm">Bắt đầu hành trình chinh phục tiếng Nga ngay hôm nay</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Họ và tên */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Họ và tên</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input 
                            placeholder="Nhập họ và tên đầy đủ" 
                            {...field} 
                            className="pl-10 bg-white border-slate-200 h-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Tên đăng nhập */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Tên đăng nhập</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <Input 
                            placeholder="Nhập tên đăng nhập" 
                            {...field} 
                            className="pl-10 bg-white border-slate-200 h-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mật khẩu */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Mật khẩu</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Nhập mật khẩu" 
                              {...field} 
                              className="pl-10 pr-10 bg-white border-slate-200 h-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
                            />
                          </div>
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nhập lại mật khẩu */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Nhập lại mật khẩu</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Nhập lại mật khẩu" 
                              {...field} 
                              className="pl-10 pr-10 bg-white border-slate-200 h-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
                            />
                          </div>
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Checkbox điều khoản */}
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600">
                    Tôi đồng ý với <Link href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</Link> và <Link href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-base font-bold uppercase shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : "Đăng ký"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm mt-8">
              <span className="text-slate-500">Đã có tài khoản? </span>
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}