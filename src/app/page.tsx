"use client"; // Chuyển sang Client ở tầng Page để demo việc thay đổi trạng thái Login/Logout

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserProfile, FeatureItem } from "@/types/user";
import { BookOpen, Bot, ClipboardCheck, FolderDown } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Quản lý trạng thái User với Type Safety
  const [user, setUser] = useState<UserProfile | null>(null);

  // Dữ liệu tính năng được định nghĩa theo Interface FeatureItem
  const features: FeatureItem[] = [
    { id: '1', title: 'Bài học', icon: <BookOpen size={40} />, href: '/lessons', buttonLabel: 'Khám phá' },
    { id: '2', title: 'Luyện tập cùng AI', icon: <Bot size={40} />, href: '/ai', buttonLabel: 'Bắt đầu' },
    { id: '3', title: 'Kiểm tra', icon: <ClipboardCheck size={40} />, href: '/exam', buttonLabel: 'Vào thi' },
    { id: '4', title: 'Tài liệu', icon: <FolderDown size={40} />, href: '/docs', buttonLabel: 'Tải xuống' },
  ];

  const handleLogout = () => {
    setUser(null); // Khi gọi hàm này, Header sẽ tự động cập nhật lại giao diện
  };

  // Hàm giả lập đăng nhập để bạn test (có thể xóa sau)
  const simulateLogin = () => {
    setUser({
      id: 'u1',
      email: 'student@vpa.edu.vn',
      full_name: 'Quang Anh',
      role: 'STUDENT'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header user={user} onLogout={handleLogout} />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-6xl w-full">
          
          {/* Nút giả lập để bạn kiểm tra tính năng Login/Logout */}
          {!user && (
            <div className="text-center mb-8">
              <button onClick={simulateLogin} className="text-[10px] text-slate-300 hover:text-slate-500 underline">
                (Click để giả lập đã Đăng nhập)
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item) => (
              <div 
                key={item.id}
                className="group bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-white hover:border-blue-100 hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-10 uppercase tracking-tight">
                  {item.title}
                </h2>
                <Link 
                  href={item.href}
                  className="w-full bg-[#F4A460] hover:bg-[#E69138] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all uppercase tracking-widest text-sm"
                >
                  {item.buttonLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}