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
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TopicCard, TopicCardProps } from '@/components/student/ai/TopicCard';
import { HeroBanner } from '@/components/common/HeroBanner';
import { DictionaryWord } from '@/types/dictionary';
import { WordContent } from '@/components/student/ai/dictionary/WordContent';
import { toast } from 'sonner';

export default function AIDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<DictionaryWord | null>(null);
  const [topicPage, setTopicPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dữ liệu 8 chủ đề từ điển tiếng Nga
  const topics: TopicCardProps[] = [
    {
      title: "Chào hỏi & Giới thiệu",
      subtitle: "Привет и Знакомство",
      icon: <Users size={22} strokeWidth={2.2} />,
      colorScheme: "blue",
      href: "/student/ai/dictionary/greeting"
    },
    {
      title: "Gia đình & Bạn bè",
      subtitle: "Семья и Друзья",
      icon: <Heart size={22} strokeWidth={2.2} />,
      colorScheme: "rose",
      href: "/student/ai/dictionary/family"
    },
    {
      title: "Số, Thời gian & Ngày",
      subtitle: "Числа, Время и Даты",
      icon: <Clock size={22} strokeWidth={2.2} />,
      colorScheme: "orange",
      href: "/student/ai/dictionary/numbers-time"
    },
    {
      title: "Nhà cửa & Đồ đạc",
      subtitle: "Дом и Мебель",
      icon: <Home size={22} strokeWidth={2.2} />,
      colorScheme: "emerald",
      href: "/student/ai/dictionary/house"
    },
    {
      title: "Thức ăn & Đồ uống",
      subtitle: "Еда и Напитки",
      icon: <Utensils size={22} strokeWidth={2.2} />,
      colorScheme: "orange",
      href: "/student/ai/dictionary/food"
    },
    {
      title: "Sinh hoạt hàng ngày",
      subtitle: "Распорядок дня",
      icon: <Sun size={22} strokeWidth={2.2} />,
      colorScheme: "cyan",
      href: "/student/ai/dictionary/daily-routine"
    },
    {
      title: "Quần áo & Màu sắc",
      subtitle: "Одежда и Цвета",
      icon: <Shirt size={22} strokeWidth={2.2} />,
      colorScheme: "purple",
      href: "/student/ai/dictionary/clothes"
    },
    {
      title: "Phương tiện & Đi lại",
      subtitle: "Транспорт и Путешествия",
      icon: <Car size={22} strokeWidth={2.2} />,
      colorScheme: "slate",
      href: "/student/ai/dictionary/transport"
    }
  ];

  const pageSize = 6;
  const totalPages = Math.ceil(topics.length / pageSize);
  const currentTopics = topics.slice((topicPage - 1) * pageSize, topicPage * pageSize);

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
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner TỪ ĐIỂN AI - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="TỪ ĐIỂN AI"
          ruTitle="СЛОВАРЬ"
          description="Tra cứu từ vựng tiếng Nga thông minh với AI hoặc khám phá theo các chủ đề thông dụng."
          icon={Book}
          gradient="from-amber-600 via-orange-500 to-amber-600"
        />

        {/* ─── Thanh tìm kiếm AI ─── */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-white/80 p-3.5 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">Tra cứu từ bất kỳ bằng AI</span>
            <span className="text-[11px] text-slate-400 font-medium">· Nhập tiếng Nga hoặc tiếng Việt</span>
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ví dụ: привет, здравствуйте, xin chào..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
                className="w-full bg-slate-50/90 rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-200 focus:bg-white border border-slate-200/70 focus:border-amber-400 transition-all disabled:opacity-60 text-slate-700"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs shadow-orange-500/20 transition-all disabled:opacity-50 disabled:bg-slate-300 flex items-center gap-1.5 flex-shrink-0 uppercase tracking-wider"
            >
              {isSearching ? (
                <><Loader2 size={14} className="animate-spin" /> Đang tra...</>
              ) : (
                <><Search size={14} /> Tra cứu</>
              )}
            </button>
          </div>
        </div>

        {/* ─── Kết quả tra cứu AI ─── */}
        {(isSearching || searchResult) && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {isSearching ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xs border border-white/80 p-8 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
                <p className="text-slate-500 font-medium text-xs">AI đang tra cứu &quot;{searchQuery}&quot;...</p>
              </div>
            ) : searchResult ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-amber-500" />
                    <span className="text-xs font-bold text-slate-600">Kết quả AI</span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors flex items-center gap-1"
                  >
                    Đóng <ArrowRight size={13} />
                  </button>
                </div>
                <WordContent word={searchResult} />
              </div>
            ) : null}
          </div>
        )}

        {/* ─── Danh sách chủ đề (hiện dưới kết quả search) ─── */}
        {!searchResult && (
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Book size={16} className="text-amber-600" />
              Khám phá theo chủ đề thông dụng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {currentTopics.map((topic, index) => (
                <TopicCard 
                  key={topic.href} 
                  {...topic} 
                  index={(topicPage - 1) * pageSize + index + 1} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Phân trang chủ đề nếu không đang xem kết quả tìm kiếm */}
      {!searchResult && totalPages > 1 && (
        <div className="mt-auto pt-3 pb-1 flex items-center justify-center gap-1.5">
          <button
            onClick={() => setTopicPage(p => Math.max(1, p - 1))}
            disabled={topicPage <= 1}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border bg-white ${
              topicPage <= 1 ? 'pointer-events-none text-slate-300 border-slate-100' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setTopicPage(p)}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border text-xs transition-all font-semibold ${
                topicPage === p
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-xs shadow-orange-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setTopicPage(p => Math.min(totalPages, p + 1))}
            disabled={topicPage >= totalPages}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border bg-white ${
              topicPage >= totalPages ? 'pointer-events-none text-slate-300 border-slate-100' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}