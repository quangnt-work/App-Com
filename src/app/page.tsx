import React from 'react';
import Image from 'next/image';
import { BookOpen, Bot, ClipboardCheck, FolderDown } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Footer } from '@/components/layout/Footer';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const features = [
    { 
      id: '1', 
      title: 'Bài học',
      ruTitle: 'Уроки',
      desc: 'Ngữ pháp, video và audio chuẩn phát âm',
      icon: <BookOpen size={28} strokeWidth={2.2} />, 
      href: '/student/lessons', 
      buttonLabel: 'Khám phá',
      iconStyles: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      buttonStyles: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
    },
    { 
      id: '2', 
      title: 'Luyện tập AI',
      ruTitle: 'ИИ Студия',
      desc: 'Hội thoại, phản xạ nói và từ điển AI',
      icon: <Bot size={28} strokeWidth={2.2} />, 
      href: '/student/ai', 
      buttonLabel: 'Bắt đầu',
      iconStyles: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
      buttonStyles: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20'
    },
    { 
      id: '3', 
      title: 'Kiểm tra', 
      ruTitle: 'Тесты',
      desc: 'Đánh giá kiến thức với ngân hàng đề thi',
      icon: <ClipboardCheck size={28} strokeWidth={2.2} />, 
      href: '/student/exams', 
      buttonLabel: 'Vào thi',
      iconStyles: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
      buttonStyles: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20'
    },
    { 
      id: '4', 
      title: 'Tài liệu', 
      ruTitle: 'Материалы',
      desc: 'Giáo trình, tài liệu tham khảo phong phú',
      icon: <FolderDown size={28} strokeWidth={2.2} />, 
      href: '/student/documents', 
      buttonLabel: 'Tải xuống',
      iconStyles: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
      buttonStyles: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-emerald-500/20'
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between relative overflow-x-hidden font-sans">
      
      {/* Background Image: Dòng sông và kiến trúc Saint Petersburg Nga */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/bg.jpg"
          alt="Phong cảnh nước Nga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        {/* Lớp phủ làm dịu sáng để các card và banner nổi bật tự nhiên */}
        <div className="absolute inset-0 bg-slate-900/10 backdrop-brightness-95" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-3 sm:py-5 relative z-10">
        <div className="max-w-6xl w-full flex flex-col items-center">
          
          {/* Top Banner Quân Chủng & Khoa (Theo Mục 1) */}
          <div className="mb-3 sm:mb-4 text-center">
            <div className="inline-block bg-[#1a5286]/95 backdrop-blur-md text-[#FFD700] px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl shadow-xl border border-blue-400/40">
              <h1 className="text-xs sm:text-sm md:text-lg font-black tracking-wider uppercase drop-shadow-xs">
                TRƯỜNG CAO ĐẲNG KỸ THUẬT PHÒNG KHÔNG-KHÔNG QUÂN
              </h1>
              <h2 className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-widest uppercase mt-0.5 text-amber-300">
                KHOA CƠ BẢN-CƠ SỞ
              </h2>
            </div>
          </div>

          {/* Logo ứng dụng Quyết Thắng cánh vàng CĐKT PK-KQ (Trung tâm) */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative w-56 sm:w-72 md:w-80 h-16 sm:h-20 md:h-24 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo-app.png"
                alt="Logo Trường CĐKT PK-KQ"
                fill
                priority
                sizes="(max-width: 768px) 240px, 320px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Grid 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full">
            {features.map((item) => (
              <div 
                key={item.id}
                className="group bg-white/85 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/70 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-center relative overflow-hidden"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3.5 transition-colors duration-300 ${item.iconStyles}`}>
                  {item.icon}
                </div>
                
                {/* Title & Russian Subtitle */}
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mb-0.5">
                  {item.title}
                </h2>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400/90 mb-2 tracking-[0.2em] uppercase">
                  {item.ruTitle}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 min-h-[36px] font-medium">
                  {item.desc}
                </p>
                
                {/* Action Link */}
                <Link 
                  href={user ? item.href : "/login"}
                  className={`mt-auto w-full flex items-center justify-center text-white font-bold py-3 rounded-xl shadow-xs hover:shadow-md transition-all uppercase tracking-wider text-xs ${item.buttonStyles}`}
                >
                  {item.buttonLabel}
                </Link>
              </div>
            ))}
          </div>

          {/* Floating Stats Strip */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center">
            <div className="inline-flex items-center gap-4 sm:gap-6 px-5 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm flex-wrap justify-center">
              {[
                { label: 'Chủ đề', value: '50+' },
                { label: 'Bài học', value: '200+' },
                { label: 'Luyện AI', value: '24/7' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-black text-blue-600 text-xs sm:text-sm">{stat.value}</span>
                  <span className="text-slate-500 font-semibold text-[11px] sm:text-xs">{stat.label}</span>
                  {idx < 2 && <div className="hidden sm:block w-px h-3.5 bg-slate-200 ml-3" />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}