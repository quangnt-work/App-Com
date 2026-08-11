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
          .from('shadowing_topics' as any)
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
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              Quản lý Shadowing AI
            </h1>
            <p className="text-gray-500 mt-2">
              Danh sách các chủ đề luyện nói AI dành cho học viên.
            </p>
          </div>
          
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
                <Plus size={20} /> Tạo mới chủ đề (AI)
              </>
            )}
          </button>
        </div>

        {/* AI Generator Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Wand2 className="text-blue-500" /> Ra lệnh cho AI tạo bài học
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Topic Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chủ đề / Ngữ cảnh (Ví dụ: "Tại sân bay", "Mua sắm")
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập ngữ cảnh cụ thể..."
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trình độ (Độ khó)
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="A1">A1 (Nhập môn) - 30 câu ngắn</option>
                    <option value="A2">A2 (Sơ cấp) - 30 câu</option>
                    <option value="B1">B1 (Trung cấp) - 25 câu dài hơn</option>
                    <option value="B2">B2 (Thành thạo) - 22 câu phức tạp</option>
                    <option value="C1">C1 (Cao cấp) - 15 câu học thuật/lóng</option>
                  </select>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ghi chú ngắn (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Mô tả cho học viên..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Hệ thống đang sáng tác và sinh Audio (Khoảng 20s-40s)...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Tạo bài học tự động
                  </>
                )}
              </button>
            </form>
            
            {/* Results / Error */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 animate-in fade-in">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 text-green-700 mb-4">
                  <CheckCircle size={24} />
                  <h3 className="text-lg font-bold">Thành công! Đã tạo bài học "{result.topic.title}"</h3>
                </div>
                
                <div className="bg-white rounded-xl border border-green-100 overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-green-50/50 sticky top-0 border-b border-green-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-green-800 w-12">#</th>
                        <th className="px-4 py-3 font-semibold text-green-800">Tiếng Nga</th>
                        <th className="px-4 py-3 font-semibold text-green-800">Tiếng Việt</th>
                        <th className="px-4 py-3 font-semibold text-green-800 w-24">Audio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.sentences.map((s: any) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-500">{s.order_index}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{s.ru}</td>
                          <td className="px-4 py-3 text-gray-600">{s.vi}</td>
                          <td className="px-4 py-3">
                            <audio src={s.audio_url} controls className="h-8 w-24" />
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
