// src/app/(student)/student/ai/immersive/page.tsx
import React from 'react';
import Link from 'next/link';
import { Drama, Mic2, ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/components/common/HeroBanner';

export default function ImmersivePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <HeroBanner
          title="Nhập vai & Phản xạ"
          description="Rèn luyện kỹ năng sinh tồn bằng tiếng Nga qua 2 phương pháp tối ưu nhất: Shadowing và Roleplay thực tế."
          icon={Drama}
        />

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {/* Card Shadowing */}
          <Link href="/student/ai/immersive/shadowing" className="group block">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Mic2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Luyện nhại giọng (Shadowing)</h2>
              <p className="text-gray-500 mb-8 flex-1 leading-relaxed">
                Phương pháp nghe và lặp lại lập tức. Hệ thống sẽ che chữ từ câu thứ 6 để ép bạn phải nghe 100%. Nâng cấp phát âm thần tốc.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all gap-1">
                Bắt đầu luyện tập <ArrowRight size={18} />
              </div>
            </div>
          </Link>

          {/* Card Roleplay */}
          <Link href="/student/ai/immersive/roleplay" className="group block">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-orange-100 text-[#f07b32] rounded-2xl flex items-center justify-center mb-6">
                <Drama size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Giả lập tình huống (Roleplay)</h2>
              <p className="text-gray-500 mb-8 flex-1 leading-relaxed">
                Đóng vai vào các tình huống thực tế như mua vé, khám bệnh, làm thủ tục hải quan. Bạn phải giao tiếp bằng giọng nói để hoàn thành nhiệm vụ.
              </p>
              <div className="flex items-center text-[#f07b32] font-semibold group-hover:gap-2 transition-all gap-1">
                Vào vai ngay <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
