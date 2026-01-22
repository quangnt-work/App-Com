// src/app/(auth)/login/page.tsx
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions/auth" // Server Action
import { LoginSchema, LoginInput } from "@/lib/schemas/auth" // Schema vừa tạo

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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
        const result = await login(values) // Cần update action login nhận object thay vì FormData

        if (result.success) {
          toast.success(result.message)
          // Redirect logic nên để Server Action trả về url hoặc xử lý tại đây
          const redirectUrl = result.role === 'admin' ? '/admin/dashboard' : '/student/profile'
          router.push(redirectUrl)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Chào mừng trở lại!</h1>
        <p className="text-slate-500">Nhập thông tin để tiếp tục.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username hoặc Email</FormLabel>
                <FormControl>
                  <Input placeholder="username123" {...field} className="bg-slate-50 border-slate-200" />
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
                <FormLabel>Mật khẩu</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="bg-slate-50 border-slate-200 pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 py-6 text-lg" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng nhập...</> : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Chưa có tài khoản? <Link href="/register" className="text-sky-500 font-bold hover:underline">Đăng ký ngay</Link>
      </div>
    </div>
  )
}