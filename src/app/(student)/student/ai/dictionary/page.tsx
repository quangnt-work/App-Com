// src/app/(student)/student/ai/dictionary/page.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Book,
  Users,
  Heart,
  Clock,
  Home,
  Utensils,
  Sun,
  Shirt,
  Car,
  Search,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard';
import { DictionaryWord } from '@/types/dictionary';
import { WordContent } from '@/components/student/ai/dictionary/WordContent';
import { toast } from 'sonner';

export default function AIDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<DictionaryWord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dữ liệu danh sách chủ đề
  const topics: TopicCardProps[] = [
    {
      title: "Chào hỏi & Giới thiệu",
      subtitle: "Привет и Знакомство",
      icon: <Users size={24} strokeWidth={2.5} />,
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-50",
      href: "/student/ai/dictionary/greeting"
    },
    {
      title: "Gia đình & Bạn bè",
      subtitle: "Семья и Друзья",
      icon: <Heart size={24} strokeWidth={2.5} />,
      borderColor: "border-red-500",
      iconColor: "text-red-500",
      iconBgColor: "bg-red-50",
      href: "/student/ai/dictionary/family"
    },
    {
      title: "Số, Thời gian & Ngày",
      subtitle: "Числа, Время и Даты",
      icon: <Clock size={24} strokeWidth={2.5} />,
      borderColor: "border-orange-500",
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-50",
      href: "/student/ai/dictionary/numbers-time"
    },
    {
      title: "Nhà cửa & Đồ đạc",
      subtitle: "Дом и Мебель",
      icon: <Home size={24} strokeWidth={2.5} />,
      borderColor: "border-green-500",
      iconColor: "text-green-500",
      iconBgColor: "bg-green-50",
      href: "/student/ai/dictionary/house"
    },
    {
      title: "Thức ăn & Đồ uống",
      subtitle: "Еда и Напитки",
      icon: <Utensils size={24} strokeWidth={2.5} />,
      borderColor: "border-orange-600",
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
      href: "/student/ai/dictionary/food"
    },
    {
      title: "Sinh hoạt hàng ngày",
      subtitle: "Распорядок дня",
      icon: <Sun size={24} strokeWidth={2.5} />,
      borderColor: "border-cyan-400",
      iconColor: "text-cyan-500",
      iconBgColor: "bg-cyan-50",
      href: "/student/ai/dictionary/daily-routine"
    },
    {
      title: "Quần áo & Màu sắc",
      subtitle: "Одежда и Цвета",
      icon: <Shirt size={24} strokeWidth={2.5} />,
      borderColor: "border-purple-500",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-50",
      href: "/student/ai/dictionary/clothes"
    },
    {
      title: "Phương tiện & Đi lại",
      subtitle: "Транспорт и Путешествия",
      icon: <Car size={24} strokeWidth={2.5} />,
      borderColor: "border-slate-600",
      iconColor: "text-slate-600",
      iconBgColor: "bg-slate-100",
      href: "/student/ai/dictionary/transport"
    }
  ];

  // ─── AI Search ──────────────────────────────────────────────────────────

  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();
    if (!query || isSearching) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      const res = await fetch('/api/dictionary-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: query }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Lỗi HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.data) throw new Error('Không tìm thấy kết quả.');

      setSearchResult(data.data as DictionaryWord);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Lỗi tra cứu');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, isSearching]);

  const clearSearch = () => {
    setSearchResult(null);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">

        {/* Hero Banner */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase mb-4">
              TỪ ĐIỂN AI
            </h1>
            <p className="text-white/90 text-sm md:text-base font-medium">
              Tra cứu từ vựng tiếng Nga bất kỳ với AI hoặc khám phá theo chủ đề
            </p>
          </div>
          <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 lg:border-4 border-white/20 bg-white/10 backdrop-blur-sm">
            <Book size={48} strokeWidth={2.5} />
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* ─── Thanh tìm kiếm AI ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#f07b32]" />
            <span className="text-sm font-bold text-gray-700">Tra cứu từ bất kỳ bằng AI</span>
            <span className="text-xs text-gray-400 font-medium">· Nhập tiếng Nga hoặc tiếng Việt</span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ví dụ: привет, здравствуйте, xin chào..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
                className="w-full bg-gray-50 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white border border-transparent focus:border-orange-200 transition-all disabled:opacity-60"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-[#f07b32] hover:bg-[#d46522] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:bg-gray-300 flex items-center gap-2 flex-shrink-0"
            >
              {isSearching ? (
                <><Loader2 size={16} className="animate-spin" /> Đang tra...</>
              ) : (
                <><Search size={16} /> Tra cứu</>
              )}
            </button>
          </div>
        </div>

        {/* ─── Kết quả tra cứu AI ─── */}
        {(isSearching || searchResult) && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {isSearching ? (
              <div className="bg-white rounded-3xl shadow-sm border p-12 flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-[#f07b32] mb-4" />
                <p className="text-gray-500 font-medium">AI đang tra cứu &quot;{searchQuery}&quot;...</p>
              </div>
            ) : searchResult ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#f07b32]" />
                    <span className="text-sm font-bold text-gray-600">Kết quả AI</span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors flex items-center gap-1"
                  >
                    Đóng <ArrowRight size={14} />
                  </button>
                </div>
                <WordContent word={searchResult} />
              </div>
            ) : null}
          </div>
        )}

        {/* ─── Danh sách chủ đề (hiện dưới kết quả search) ─── */}
        {!searchResult && (
          <>
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Book size={20} className="text-[#f07b32]" />
              Hoặc khám phá theo chủ đề
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {topics.map((topic, index) => (
                <TopicCard key={index} {...topic} />
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}