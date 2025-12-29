'use client'

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { login } from "@/lib/actions/auth"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner" // Đảm bảo đã npm install sonner

// Component nút Submit
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 py-6 text-lg" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : "Đăng nhập"}
    </Button>
  )
}

export default function LoginPage() {
  const [state, action] = useFormState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Lắng nghe kết quả login
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      
      // Delay nhỏ để user kịp đọc thông báo rồi mới chuyển trang
      const timer = setTimeout(() => {
        if (state.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/student/profile')
        }
      }, 300)
      
      return () => clearTimeout(timer)
    } 
    
    if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Chào mừng trở lại!</h1>
        <p className="text-slate-500">Nhập thông tin để tiếp tục.</p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label>Username hoặc Email</Label>
          <Input name="identifier" placeholder="username123" required className="bg-slate-50 border-slate-200" />
        </div>

        <div className="space-y-2">
          <Label>Mật khẩu</Label>
          <div className="relative">
            <Input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              className="bg-slate-50 border-slate-200 pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <SubmitButton />
      </form>
      
      <div className="text-center text-sm">
         Chưa có tài khoản? <a href="/register" className="text-sky-500 font-bold hover:underline">Đăng ký ngay</a>
      </div>
    </div>
  )
}