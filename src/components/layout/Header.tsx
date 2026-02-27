// src/components/layout/header.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  user?: { name: string; role: string } | null;
}

export const Header = ({ user }: HeaderProps) => {
  // Trong thực tế, user sẽ được lấy từ Auth Context hoặc Supabase
  const isLoggedIn = !!user;

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
              <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 rounded-full border">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <User size={14} />
                </div>
                <span className="text-xs font-semibold text-slate-700 uppercase">{user?.role || 'Học viên'}</span>
              </div>
              <button className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};