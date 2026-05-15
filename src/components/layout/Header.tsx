// src/components/layout/header.tsx

"use client";

import React, { useTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Loader2, Home } from 'lucide-react';
import { logout, getAuthUser } from '@/lib/actions/auth'; 
import { toast } from 'sonner';

interface UserData {
  name: string;
  role: string;
}

export const Header = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition(); 

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const userData = await getAuthUser();
        if (isMounted) {
          setUser(userData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    
    return () => { isMounted = false; };
  }, [pathname]); // Fetch lại khi route thay đổi (sau khi login/logout)

  const isLoggedIn = !!user;

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout(); 
        toast.success("Đã đăng xuất thành công!");
        setUser(null);
        router.push('/');
        router.refresh();
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi đăng xuất.");
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Quốc kỳ */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-5 shadow-sm border">
            <Image src="https://flagpedia.net/data/flags/h80/vn.png" alt="VN" fill className="object-cover" unoptimized />
          </div>
          <div className="relative w-8 h-5 shadow-sm border">
            <Image src="https://flagpedia.net/data/flags/h80/ru.png" alt="RU" fill className="object-cover" unoptimized />
          </div>
        </div>

        {/* Center: Title (Ẩn trên mobile nhỏ) */}
        <h1 className="hidden md:block font-bold text-blue-900 uppercase text-center flex-1 px-4 leading-tight text-sm lg:text-base">
          Website hỗ trợ giảng dạy và tự học tiếng Nga
        </h1>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center justify-center p-2 text-slate-400">
               <Loader2 size={20} className="animate-spin" />
            </div>
          ) : !isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-blue-700 px-3 py-2 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-bold bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-all shadow-md"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* === NÚT HOME === */}
              <Link 
                href={user?.role === 'admin' ? '/admin/dashboard' : '/'} 
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center justify-center"
                title={user?.role === 'admin' ? "Admin Dashboard" : "Trang chủ"}
              >
                <Home size={20} />
              </Link>

              {/* === NÚT PROFILE (CHỈ CHO HỌC VIÊN) === */}
              {user?.role !== 'admin' && (
                <Link 
                  href="/student/profile" 
                  className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center justify-center"
                  title="Hồ sơ cá nhân"
                >
                  <User size={20} />
                </Link>
              )}

              {/* === TÊN USER (CHỈ HIỂN THỊ) === */}
              <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 rounded-full border cursor-default" title="Vai trò">
                <span className="text-xs font-semibold text-slate-700 uppercase">
                  {user?.role === 'admin' ? 'Quản trị' : (user?.name || 'Học viên')}
                </span>
              </div>
              
              {/* === NÚT LOGOUT === */}
              <button 
                onClick={handleLogout}
                disabled={isPending}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                title="Đăng xuất"
              >
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
              </button>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};