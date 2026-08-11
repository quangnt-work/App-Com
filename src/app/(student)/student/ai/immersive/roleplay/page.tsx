'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Drama, ArrowRight, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function RoleplayListPage() {
  const router = useRouter();
  const [level, setLevel] = useState('B1');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dynamicScenarios, setDynamicScenarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchScenarios = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('roleplay_scenarios')
        .select('id, title, level, context, objectives')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setDynamicScenarios(data);
      }
    };
    fetchScenarios();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Vui lòng nhập chủ đề bạn muốn luyện tập.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, topic }),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || "Có lỗi xảy ra");
      
      // Xóa cache cũ để tránh nhầm
      sessionStorage.removeItem('dynamic_roleplay');
      
      toast.success("Tạo kịch bản thành công!");
      // Vào thẳng ID vừa tạo (sẽ load từ DB) thay vì qua id dynamic
      router.push(`/student/ai/immersive/roleplay/${json.data.id}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

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
              Hóa thân vào các tình huống thực tế tại Nga. Giao tiếp bằng giọng nói để vượt qua thử thách!
            </p>
          </div>
        </div>

        {/* Bảng tạo kịch bản động bằng AI */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-3xl mb-8 border border-orange-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-orange-800 mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-orange-500" /> Tạo Kịch Bản Bằng AI
              </h2>
              <p className="text-orange-700/80 text-sm mb-4">
                Nhập tình huống bạn muốn (ví dụ: &quot;Phỏng vấn xin việc bán thời gian&quot;, &quot;Giải thích với cảnh sát&quot;) và AI sẽ tự động thiết kế một thử thách riêng cho bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={level} 
                  onChange={e => setLevel(e.target.value)}
                  disabled={isGenerating}
                  className="p-3 rounded-xl border border-orange-200 outline-none focus:ring-2 focus:ring-orange-300 font-medium text-gray-700 bg-white"
                >
                  <option value="A2">Cấp độ A2 (Cơ bản) — 5 mục tiêu</option>
                  <option value="B1">Cấp độ B1 (Trung cấp) — 7 mục tiêu</option>
                  <option value="B2">Cấp độ B2 (Thượng cấp) — 10 mục tiêu</option>
                  <option value="C1">Cấp độ C1 (Nâng cao) — 13 mục tiêu</option>
                </select>
                <input 
                  type="text"
                  placeholder="Nhập chủ đề bạn muốn luyện tập..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1 p-3 rounded-xl border border-orange-200 outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 bg-white"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-[#f07b32] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e26a24] transition-colors whitespace-nowrap flex items-center justify-center min-w-[140px]"
                >
                  {isGenerating ? <Loader2 size={20} className="animate-spin" /> : "Tạo Kịch Bản"}
                </button>
              </div>
            </div>
          </div>
          {/* Background element */}
          <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 pointer-events-none">
            <Drama size={150} />
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-gray-800 mb-4 px-2">Kịch bản có sẵn</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {roleplayData.map((t, idx) => (
            <Link key={t.id} href={`/student/ai/immersive/roleplay/${t.id}`}>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#f07b32] hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md ${t.level === 1 ? 'bg-green-100 text-green-700' :
                      t.level === 2 ? 'bg-blue-100 text-blue-700' :
                        t.level === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                    }`}>
                    Độ khó: {t.level}
                  </span>
                  <span className="text-gray-400 text-sm">{t.objectives.length} mục tiêu</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#f07b32] transition-colors mb-2">
                  {idx + 1}. {t.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">{t.context}</p>

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

        {dynamicScenarios.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold text-gray-800 mb-4 px-2 mt-8 flex items-center gap-2">
              <Sparkles size={20} className="text-orange-500" /> Kịch bản cộng đồng tạo bằng AI
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dynamicScenarios.map((t) => (
                <Link key={t.id} href={`/student/ai/immersive/roleplay/${t.id}`}>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#f07b32] hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-100 to-transparent opacity-50 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-md bg-purple-100 text-purple-700">
                        Độ khó: {t.level}
                      </span>
                      <span className="text-gray-400 text-sm">{t.objectives?.length || 0} mục tiêu</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#f07b32] transition-colors mb-2">
                      {t.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{t.context}</p>

                    <div className="flex items-center justify-between border-t border-dashed pt-4 mt-auto">
                      <div className="flex items-center gap-1 text-sm text-gray-400 font-medium">
                        <CheckCircle2 size={16} /> Bắt đầu ngay
                      </div>
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#f07b32] group-hover:text-white transition-colors text-orange-400">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
