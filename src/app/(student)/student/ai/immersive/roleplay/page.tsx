// src/app/(student)/student/ai/immersive/roleplay/page.tsx
import React from 'react';
import Link from 'next/link';
import { Drama, ArrowRight, CheckCircle2 } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';

export default function RoleplayListPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1000px]">

        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-100 text-[#f07b32] rounded-2xl flex items-center justify-center shrink-0">
            <Drama size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Giả lập tình huống (Roleplay)</h1>
            <p className="text-gray-500 text-lg">
              Bạn sẽ hóa thân vào các tình huống thực tế tại Nga. Hãy giao tiếp bằng giọng nói để hoàn thành toàn bộ các mục tiêu đề ra!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roleplayData.map((topic, idx) => (
            <Link key={topic.id} href={`/student/ai/immersive/roleplay/${topic.id}`}>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#f07b32] hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md ${topic.level === 1 ? 'bg-green-100 text-green-700' :
                      topic.level === 2 ? 'bg-blue-100 text-blue-700' :
                        topic.level === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                    }`}>
                    Độ khó: {topic.level}
                  </span>
                  <span className="text-gray-400 text-sm">{topic.objectives.length} mục tiêu</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#f07b32] transition-colors mb-2">
                  {idx + 1}. {topic.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">{topic.context}</p>

                <div className="flex items-center justify-between border-t border-dashed pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-sm text-gray-400 font-medium">
                    <CheckCircle2 size={16} /> Hoàn thành mục tiêu
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#f07b32] group-hover:text-white transition-colors text-orange-400">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
