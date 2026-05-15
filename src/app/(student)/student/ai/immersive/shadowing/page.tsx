// src/app/(student)/student/ai/immersive/shadowing/page.tsx
import React from 'react';
import Link from 'next/link';
import { Mic2, ArrowRight } from 'lucide-react';
import shadowingData from '@/data/shadowing.json';

export default function ShadowingListPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Mic2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Luyện nhại giọng (Shadowing)</h1>
            <p className="text-gray-500 text-lg">
              Luật chơi: 5 câu đầu hiển thị chữ. Từ câu số 6, chữ sẽ bị che mờ hoàn toàn. Bạn phải dùng kỹ năng Nghe để bắt chước lại ngay lập tức.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {shadowingData.map((topic, idx) => (
            <Link key={topic.id} href={`/student/ai/immersive/shadowing/${topic.id}`}>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                      Cấp độ {topic.level}
                    </span>
                    <span className="text-gray-400 text-sm">{topic.sentences.length} câu</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {idx + 1}. {topic.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
