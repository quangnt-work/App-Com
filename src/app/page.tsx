// src/app/page.tsx
import React from 'react';
import { BookOpen, Bot, ClipboardCheck, FolderDown } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // Import Supabase Server

export default async function HomePage() {
  // Gọi Supabase server để check auth ngay từ phía máy chủ
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const features = [
    { id: '1', title: 'Bài học', icon: <BookOpen size={40} />, href: '/student/lessons', buttonLabel: 'Khám phá' },
    { id: '2', title: 'Luyện tập cùng AI', icon: <Bot size={40} />, href: '/student/ai', buttonLabel: 'Bắt đầu' },
    { id: '3', title: 'Kiểm tra', icon: <ClipboardCheck size={40} />, href: '/student/exams', buttonLabel: 'Vào thi' },
    { id: '4', title: 'Tài liệu', icon: <FolderDown size={40} />, href: '/student/documents', buttonLabel: 'Tải xuống' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item) => (
              <div 
                key={item.id}
                className="group h-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-white hover:border-blue-100 hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                
                <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">
                  {item.title}
                </h2>
                
                {/* Thay thế button = Link để không cần dùng "use client" */}
                <Link 
                  href={user ? item.href : "/login"} // Nếu chưa đăng nhập, trỏ về trang login
                  className="mt-auto w-full flex items-center justify-center bg-[#F4A460] hover:bg-[#E69138] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all uppercase tracking-widest text-sm"
                >
                  {item.buttonLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}