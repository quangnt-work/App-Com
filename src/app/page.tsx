// src/app/page.tsx
import React from 'react';
import { BookOpen, Bot, ClipboardCheck, FolderDown } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // Import Supabase Server

export default async function HomePage() {
  // Gọi Supabase server để check auth ngay từ phía máy chủ
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const features = [
    { 
      id: '1', 
      title: 'Bài học', 
      icon: <BookOpen size={40} />, 
      href: '/student/lessons', 
      buttonLabel: 'Khám phá',
      iconStyles: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      cardHover: 'hover:border-blue-200 hover:shadow-blue-500/10',
      buttonStyles: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
    },
    { 
      id: '2', 
      title: 'Luyện tập cùng AI', 
      icon: <Bot size={40} />, 
      href: '/student/ai', 
      buttonLabel: 'Bắt đầu',
      iconStyles: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      cardHover: 'hover:border-indigo-200 hover:shadow-indigo-500/10',
      buttonStyles: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/25'
    },
    { 
      id: '3', 
      title: 'Kiểm tra', 
      icon: <ClipboardCheck size={40} />, 
      href: '/student/exams', 
      buttonLabel: 'Vào thi',
      iconStyles: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      cardHover: 'hover:border-amber-200 hover:shadow-orange-500/10',
      buttonStyles: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/25'
    },
    { 
      id: '4', 
      title: 'Tài liệu', 
      icon: <FolderDown size={40} />, 
      href: '/student/documents', 
      buttonLabel: 'Tải xuống',
      iconStyles: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      cardHover: 'hover:border-emerald-200 hover:shadow-emerald-500/10',
      buttonStyles: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-emerald-500/25'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item) => (
              <div 
                key={item.id}
                className={`group h-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 ${item.cardHover} hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-colors duration-300 ${item.iconStyles}`}>
                  {item.icon}
                </div>
                
                <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">
                  {item.title}
                </h2>
                
                {/* Thay thế button = Link để không cần dùng "use client" */}
                <Link 
                  href={user ? item.href : "/login"} // Nếu chưa đăng nhập, trỏ về trang login
                  className={`mt-auto w-full flex items-center justify-center text-white font-bold py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-sm ${item.buttonStyles}`}
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