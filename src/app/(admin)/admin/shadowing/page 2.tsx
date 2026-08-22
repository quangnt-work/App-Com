'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Wand2, CheckCircle, AlertCircle, Plus, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function AdminShadowingPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [topicName, setTopicName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('A1');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch topics
  useEffect(() => {
    async function loadTopics() {
      try {
        const { data, error } = await supabase
          .from('shadowing_topics')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTopics(data || []);
      } catch (err) {
        console.error('Lỗi tải danh sách chủ đề:', err);
        toast.error('Không thể tải danh sách chủ đề.');
      } finally {
        setIsFetching(false);
      }
    }
    loadTopics();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topicName.trim()) {
      toast.error('Vui lòng nhập tên chủ đề');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/shadowing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicName, description, level }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo kịch bản');
      }

      setResult(data);
      toast.success('Tạo kịch bản thành công!');
      
      // Thêm topic mới vào danh sách
      setTopics(prev => [data.topic, ...prev]);
      
      // Tùy chọn: Đóng form sau khi tạo thành công
      // setShowForm(false);
      
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
        
        <div className="bg-blue-600 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
          <div className="flex items-center gap-4">
            <BookOpen size={40} className="opacity-90" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">Quản lý Shadowing</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-blue-100">
            <span>Danh sách chủ đề luyện nói AI</span>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setResult(null);
              setError(null);
            }}
            className="bg-blue-600 text-white font-semibold rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            {showForm ? 'Đóng form' : (
              <>
                <Plus size={20} /> Tạo mới chủ đề
              </>
            )}
          </button>
        </div>

        {/* AI Generator Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 p-8 md:p-12 mb-12 relative overflow-hidden max-w-4xl mx-auto">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 mb-4 shadow-sm border border-blue-100">
                <Wand2 size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Ra lệnh cho AI sáng tác</h2>
              <p className="text-gray-500">Hệ thống sẽ tự động viết kịch bản tiếng Nga và thu âm giọng bản ngữ.</p>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                {/* Topic Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Chủ đề / Ngữ cảnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-gray-800 font-medium"
                    placeholder="Ví dụ: Phỏng vấn xin việc, Mua sắm tại siêu thị..."
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Level */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Độ khó (Trình độ)
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white text-gray-800 font-medium transition-all"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="A1">A1 (Nhập môn) - Dễ</option>
                      <option value="A2">A2 (Sơ cấp) - Trung bình</option>
                      <option value="B1">B1 (Trung cấp) - Khá</option>
                      <option value="B2">B2 (Thành thạo) - Khó</option>
                      <option value="C1">C1 (Cao cấp) - Rất khó</option>
                    </select>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ghi chú thêm (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-gray-800"
                      placeholder="Yêu cầu riêng cho AI..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Hệ thống đang sáng tác & thu âm (20s - 40s)...
                    </>
                  ) : (
                    <>
                      <Wand2 size={24} />
                      Tạo bài học tự động
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
                  <h3 className="text-xl font-bold">Thành công! Đã tạo bài học "{result.topic.title}"</h3>
                </div>
                
                <div className="bg-white rounded-xl border border-green-100 overflow-hidden max-h-[350px] overflow-y-auto shadow-inner">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-green-50/50 sticky top-0 border-b border-green-100 backdrop-blur-sm z-10">
                      <tr>
                        <th className="px-5 py-4 font-bold text-green-800 w-12 text-center">#</th>
                        <th className="px-5 py-4 font-bold text-green-800">Tiếng Nga</th>
                        <th className="px-5 py-4 font-bold text-green-800">Tiếng Việt</th>
                        <th className="px-5 py-4 font-bold text-green-800 w-32 text-center">Audio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.sentences.map((s: any) => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-gray-400 font-medium text-center">{s.order_index}</td>
                          <td className="px-5 py-4 font-bold text-gray-900">{s.ru}</td>
                          <td className="px-5 py-4 text-gray-600">{s.vi}</td>
                          <td className="px-5 py-4 text-center">
                            <audio src={s.audio_url} controls className="h-8 w-28 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danh sách chủ đề */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thư viện bài học đã tạo</h2>
          
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p>Đang tải danh sách...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">Chưa có bài học nào</h3>
              <p className="text-gray-500 mt-2">Hãy nhấn "Tạo mới chủ đề (AI)" để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                      {t.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{t.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] mb-4">
                    {t.description || 'Không có mô tả'}
                  </p>
                  
                  <div className="flex items-center text-gray-400 text-xs gap-1 pt-4 border-t border-gray-50">
                    <Clock size={14} />
                    <span>Tạo ngày: {new Date(t.created_at).toLocaleDateString('vi-VN')}</span>
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
