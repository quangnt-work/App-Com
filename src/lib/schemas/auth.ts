// src/lib/schemas/auth.ts
import * as z from "zod"

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập username hoặc email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  username: z.string().min(3, "Username tối thiểu 3 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Username không chứa ký tự đặc biệt"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>