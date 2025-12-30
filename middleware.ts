// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";

// 1. Định nghĩa các Route Rules rõ ràng
const ROUTES = {
  auth: ['/login', '/register'],
  admin: ['/admin'],
  student: ['/student', '/learn'],
  public: ['/']
}

function isRoute(path: string, routes: string[]) {
  return routes.some(route => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const userRole = user?.user_metadata?.role || "student";

  // CASE 1: Chưa đăng nhập truy cập trang bảo vệ
  if (!user) {
    if (isRoute(path, ROUTES.admin) || isRoute(path, ROUTES.student)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  // CASE 2: Đã đăng nhập nhưng vào trang Auth
  if (isRoute(path, ROUTES.auth)) {
    const redirectUrl = userRole === "admin" ? "/admin/dashboard" : "/student/courses";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // CASE 3: Role Based Access Control (RBAC)
  if (isRoute(path, ROUTES.admin) && userRole !== "admin") {
    // Không có quyền admin -> Đá về trang student
    return NextResponse.redirect(new URL("/student/courses", request.url));
  }

  return response;
}