import React from 'react';
import { BookOpen, Bot, ClipboardCheck, FolderDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Footer } from '@/components/layout/Footer';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const userName = user?.user_metadata?.full_name || 'Học viên';

  const features = [
    { 
      id: '1', 
      title: 'Bài học',
      ruTitle: 'Уроки',
      desc: 'Ngữ pháp, video và audio chuẩn phát âm',
      icon: <BookOpen size={28} strokeWidth={2.2} />, 
      href: '/student/lessons', 
      buttonLabel: 'Khám phá',
      badge: 'Cốt lõi',
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
      badge: 'Thông minh',
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
      badge: 'Đánh giá',
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
      badge: 'Kho tài liệu',
      iconStyles: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
      buttonStyles: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-emerald-500/20'
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Mesh Gradient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-indigo-300/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-violet-300/30 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="max-w-6xl w-full">
          
          {/* Welcome Header (Hero Section) */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-blue-700 text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-sm">
              <Sparkles size={16} className="text-blue-600" />
              <span>Cổng học tập & nghiên cứu tiếng Nga</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-5 sm:gap-7 mb-5">
              {user && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-blue-600/20 ring-4 ring-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.15]">
                {user ? (
                  <>
                    Chào mừng, <br className="sm:hidden" />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      {userName}
                    </span>!
                  </>
                ) : (
                  <>
                    Chào mừng đến với <br className="sm:hidden" />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      RU·Learn
                    </span>
                  </>
                )}
              </h1>
            </div>

            <p className="text-slate-500/90 text-sm sm:text-lg md:text-xl mt-4 max-w-2xl mx-auto font-medium px-4">
              Lựa chọn phân hệ học tập dưới đây để tiếp tục hành trình nâng cao năng lực ngôn ngữ của bạn
            </p>
          </div>

          {/* Grid 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {features.map((item) => (
              <div 
                key={item.id}
                className="group bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-center relative overflow-hidden"
              >
                {/* Badge top-right */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-slate-100/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/50">
                    {item.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 transition-colors duration-300 ${item.iconStyles}`}>
                  {item.icon}
                </div>
                
                {/* Title & Russian Subtitle */}
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {item.title}
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-slate-400/80 mb-3 tracking-[0.2em] uppercase">
                  {item.ruTitle}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 min-h-[40px] font-medium">
                  {item.desc}
                </p>
                
                {/* Action Link */}
                <Link 
                  href={user ? item.href : "/login"}
                  className={`mt-auto w-full flex items-center justify-center text-white font-bold py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all uppercase tracking-wider text-xs sm:text-sm ${item.buttonStyles}`}
                >
                  {item.buttonLabel}
                </Link>
              </div>
            ))}
          </div>

          {/* Floating Stats Strip */}
          <div className="mt-12 sm:mt-16 flex items-center justify-center">
            <div className="inline-flex items-center gap-4 sm:gap-8 px-6 py-3.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-wrap justify-center">
              {[
                { label: 'Chủ đề', value: '50+' },
                { label: 'Bài học', value: '200+' },
                { label: 'Luyện AI', value: '24/7' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-black text-blue-600 text-sm sm:text-base">{stat.value}</span>
                  <span className="text-slate-500 font-semibold text-xs sm:text-sm">{stat.label}</span>
                  {idx < 2 && <div className="hidden sm:block w-px h-4 bg-slate-200 ml-4" />}
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