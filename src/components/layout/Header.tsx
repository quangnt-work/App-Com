// src/components/layout/header.tsx
"use client";

import React, { useTransition } from 'react';
import Link from 'next/link';
import { LogOut, User, Loader2, Home } from 'lucide-react'; // Thêm import Home
import { logout } from '@/lib/actions/auth'; 
import { toast } from 'sonner';

interface HeaderProps {
  user?: { 
    name?: string; 
    role?: string 
  } | null; // Cập nhật type cho linh hoạt
}

export const Header = ({ user }: HeaderProps) => {
  const isLoggedIn = !!user;
  const [isPending, startTransition] = useTransition(); 

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout(); 
        toast.success("Đã đăng xuất thành công!");
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
            <img src="https://flagpedia.net/data/flags/h80/vn.png" alt="VN" className="object-cover w-full h-full" />
          </div>
          <div className="relative w-8 h-5 shadow-sm border">
            <img src="https://flagpedia.net/data/flags/h80/ru.png" alt="RU" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Center: Title (Ẩn trên mobile nhỏ) */}
        <h1 className="hidden md:block font-bold text-blue-900 uppercase text-center flex-1 px-4 leading-tight text-sm lg:text-base">
          Website hỗ trợ giảng dạy và tự học tiếng Nga
        </h1>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
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
              {/* === NÚT HOME (Chỉ hiện khi đã đăng nhập) === */}
              <Link 
                href="/" 
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center justify-center"
                title="Trang chủ"
              >
                <Home size={20} />
              </Link>

              {/* === USER PROFILE BUBBLE === */}
              <Link 
                href={"/student/profile"} 
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center justify-center"
                title="Hồ sơ">
                <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 rounded-full border cursor-default">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <User size={14} />
                  </div>
                  {/* Hiển thị Role hoặc Tên nếu có truyền vào từ props */}
                  <span className="text-xs font-semibold text-slate-700 uppercase">
                    {user?.role === 'admin' ? 'Quản trị' : (user?.name || 'Học viên')}
                  </span>
                </div>
              </Link>
              
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