"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signup } from "@/lib/actions/auth"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  username: z.string().min(3, "Username tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Username không chứa ký tự đặc biệt"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", username: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    try {
      const result = await signup(values)
      
      if (result.success) {
        toast.success(result.message)
        setTimeout(() => router.push('/login'), 1500)
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
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Tạo tài khoản mới</h1>
        <p className="text-slate-500">Tham gia cộng đồng học tập ngay hôm nay.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input placeholder="nguyenvana123" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-sky-500 py-6 text-lg hover:bg-sky-600" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : "Đăng ký tài khoản"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Đã có tài khoản? <Link href="/login" className="text-sky-500 font-bold hover:underline">Đăng nhập</Link>
      </div>
    </div>
  )
}