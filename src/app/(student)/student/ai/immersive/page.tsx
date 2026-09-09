// src/app/(student)/student/ai/immersive/page.tsx
import React from 'react';
import Link from 'next/link';
import { Drama, Mic2, ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/components/common/HeroBanner';

export default function ImmersivePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <HeroBanner
          title="Nhập vai & Phản xạ"
          description="Rèn luyện kỹ năng sinh tồn bằng tiếng Nga qua 2 phương pháp tối ưu nhất: Shadowing và Roleplay thực tế."
          icon={Drama}
          gradient="from-indigo-700 via-violet-600 to-purple-700"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {/* Card Shadowing */}
          <Link href="/student/ai/immersive/shadowing" className="group block">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/70 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Mic2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">Luyện nhại giọng (Shadowing)</h2>
              <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
                Phương pháp nghe và lặp lại lập tức. Hệ thống sẽ che chữ từ câu thứ 6 để ép bạn phải nghe 100%. Nâng cấp phát âm thần tốc.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all gap-1">
                Bắt đầu luyện tập <ArrowRight size={18} />
              </div>
            </div>
          </Link>

          {/* Card Roleplay */}
          <Link href="/student/ai/immersive/roleplay" className="group block">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/70 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-violet-50 border border-violet-100/80 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                <Drama size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-violet-600 transition-colors">Giả lập tình huống (Roleplay)</h2>
              <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
                Đóng vai vào các tình huống thực tế như mua vé, khám bệnh, làm thủ tục hải quan. Bạn phải giao tiếp bằng giọng nói để hoàn thành nhiệm vụ.
              </p>
              <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all gap-1">
                Vào vai ngay <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
