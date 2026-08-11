'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Wand2, CheckCircle, AlertCircle, Plus, Drama, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function AdminRoleplayPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('B1');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch scenarios
  useEffect(() => {
    async function loadScenarios() {
      try {
        const { data, error } = await supabase
          .from('roleplay_scenarios')
          .select('id, title, level, context, created_at, objectives')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setScenarios(data || []);
      } catch (err) {
        console.error('Lỗi tải danh sách kịch bản roleplay:', err);
        toast.error('Không thể tải danh sách.');
      } finally {
        setIsFetching(false);
      }
    }
    loadScenarios();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error('Vui lòng nhập chủ đề tình huống.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/roleplay/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo kịch bản');
      }

      setResult(data.data);
      toast.success('Tạo kịch bản thành công!');
      
      // Thêm kịch bản mới vào danh sách
      setScenarios(prev => [{
        id: data.data.id,
        title: data.data.title,
        level: level,
        context: data.data.context,
        created_at: new Date().toISOString(),
        objectives: data.data.objectives
      }, ...prev]);
      
    } catch (err: any) {
      setError(err.message);
      toast.error('Lỗi: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-orange-500 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
          <div className="flex items-center gap-4">
            <Drama size={40} className="opacity-90" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">Quản lý Roleplay</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-orange-100">
            <span>Danh sách tình huống giao tiếp</span>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setResult(null);
              setError(null);
            }}
            className="bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-orange-700 transition-colors shadow-sm"
          >
            {showForm ? 'Đóng form' : (
              <>
                <Plus size={20} /> Tạo mới tình huống
              </>
            )}
          </button>
        </div>

        {/* AI Generator Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100 p-8 md:p-12 mb-12 relative overflow-hidden max-w-4xl mx-auto">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 text-orange-600 mb-4 shadow-sm border border-orange-100">
                <Wand2 size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Ra lệnh cho AI sáng tác</h2>
              <p className="text-gray-500">Hệ thống sẽ tự động thiết kế tình huống và các thử thách nhập vai.</p>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                {/* Topic Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Chủ đề / Bối cảnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-500 transition-all text-gray-800 font-medium"
                    placeholder="Ví dụ: Phỏng vấn xin việc, Giải thích với cảnh sát..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Trình độ & Mục tiêu
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-500 bg-white text-gray-800 font-medium transition-all"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="A2">A2 (Cơ bản) — 5 mục tiêu</option>
                    <option value="B1">B1 (Trung cấp) — 7 mục tiêu</option>
                    <option value="B2">B2 (Thượng cấp) — 10 mục tiêu</option>
                    <option value="C1">C1 (Nâng cao) — 13 mục tiêu</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f07b32] text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-[#e26a24] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Hệ thống đang sáng tác...
                    </>
                  ) : (
                    <>
                      <Wand2 size={24} />
                      Tạo tình huống tự động
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Results / Error */}
            {error && (
              <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 text-red-700 animate-in fade-in">
                <AlertCircle size={24} className="shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-8 animate-in slide-in-from-bottom-4 shadow-sm">
                <div className="flex flex-col items-center text-center text-green-700 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="text-xl font-bold">Thành công! "{result.title}"</h3>
                </div>
                
                <div className="bg-white rounded-xl border border-green-100 p-6 shadow-inner">
                  <p className="text-gray-700 font-bold mb-2">Bối cảnh:</p>
                  <p className="text-gray-600 mb-6">{result.context}</p>
                  
                  <p className="text-gray-700 font-bold mb-2">Vai trò AI:</p>
                  <p className="text-gray-600 mb-6">{result.ai_role}</p>
                  
                  <p className="text-gray-700 font-bold mb-3">Mục tiêu thử thách ({result.objectives?.length || 0}):</p>
                  <ul className="space-y-3">
                    {result.objectives?.map((obj: any, idx: number) => (
                      <li key={obj.id} className="flex gap-4 text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <span className="font-extrabold text-orange-500 bg-orange-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                        <span className="font-medium text-gray-700">{obj.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danh sách kịch bản */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thư viện tình huống đã tạo</h2>
          
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p>Đang tải danh sách...</p>
            </div>
          ) : scenarios.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Drama className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">Chưa có tình huống nào</h3>
              <p className="text-gray-500 mt-2">Hãy nhấn "Tạo mới tình huống" để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-md">
                      {t.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{t.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] mb-4">
                    {t.context || 'Không có mô tả'}
                  </p>
                  
                  <div className="flex items-center justify-between text-gray-400 text-xs pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>{t.objectives?.length || 0} mục tiêu</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(t.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
