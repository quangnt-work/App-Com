// src/app/(student)/student/ai/immersive/page.tsx
import React from 'react';
import Link from 'next/link';
import { Drama, Mic2, ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/components/common/HeroBanner';

export default function ImmersivePage() {
  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col">
      {/* Banner NHẬP VAI & PHẢN XẠ - Đồng bộ thiết kế & kích thước */}
      <HeroBanner
        title="NHẬP VAI & PHẢN XẠ"
        ruTitle="РЕФЛЕКСЫ"
        description="Rèn luyện kỹ năng sinh tồn bằng tiếng Nga qua 2 phương pháp tối ưu nhất: Shadowing và Roleplay thực tế."
        icon={Drama}
        gradient="from-indigo-700 via-violet-600 to-purple-700"
      />

      <div className="flex-1 flex flex-col justify-start pt-2 sm:pt-4 pb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Shadowing */}
          <Link href="/student/ai/shadowing" className="group block h-full">
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-6 sm:p-7 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 border border-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic2 size={30} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                Luyện nhại giọng (Shadowing)
              </h2>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 mb-2">
                СЛУШАЙ И ПОВТОРЯЙ
              </p>
              <p className="text-xs sm:text-[13px] text-slate-500 mb-6 flex-1 leading-relaxed">
                Phương pháp nghe và lặp lại lập tức. Hệ thống sẽ che chữ từ câu thứ 6 để ép bạn phải nghe 100%. Nâng cấp phát âm thần tốc.
              </p>
              <div className="mt-auto w-full flex items-center justify-center text-white font-bold py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xs hover:shadow-md transition-all uppercase tracking-wider text-xs gap-1.5">
                Bắt đầu luyện tập <ArrowRight size={15} />
              </div>
            </div>
          </Link>

          {/* Card Roleplay */}
          <Link href="/student/ai/roleplay" className="group block h-full">
            <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-6 sm:p-7 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-violet-50 border border-violet-100/80 text-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Drama size={30} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                Giả lập tình huống (Roleplay)
              </h2>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 mb-2">
                СИТУАЦИИ И РОЛИ
              </p>
              <p className="text-xs sm:text-[13px] text-slate-500 mb-6 flex-1 leading-relaxed">
                Đóng vai vào các tình huống thực tế như mua vé, khám bệnh, làm thủ tục hải quan. Bạn phải giao tiếp bằng giọng nói để hoàn thành nhiệm vụ.
              </p>
              <div className="mt-auto w-full flex items-center justify-center text-white font-bold py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 shadow-xs hover:shadow-md transition-all uppercase tracking-wider text-xs gap-1.5">
                Vào vai ngay <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
