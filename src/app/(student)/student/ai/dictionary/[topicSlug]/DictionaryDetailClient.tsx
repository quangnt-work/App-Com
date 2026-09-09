'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DictionaryWord } from '@/types/dictionary';
import { WordContent } from '@/components/student/ai/dictionary/WordContent';

interface Props {
  words: DictionaryWord[];
  topicName: string;
}

export default function DictionaryDetailClient({ words, topicName }: Props) {
  const router = useRouter();
  const [activeWordId, setActiveWordId] = useState<string>(words[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc từ vựng theo thanh tìm kiếm
  const filteredWords = words.filter(w => 
    w.russian_word.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.vietnamese_meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWord = words.find(w => w.id === activeWordId) || words[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-10">

      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        
        {/* CỘT TRÁI: Danh sách từ vựng */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200/80 flex flex-col h-full overflow-hidden">
          {/* Thanh tìm kiếm */}
          <div className="p-5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm từ vựng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white border border-slate-200/70 focus:border-indigo-400 transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Danh sách List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredWords.map((word) => {
              const isActive = word.id === activeWordId;
              return (
                <button
                  key={word.id}
                  onClick={() => setActiveWordId(word.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50/80 border border-indigo-200/80 shadow-xs' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <h4 className={`text-lg font-bold mb-1 ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {word.russian_word}
                  </h4>
                  <p className="text-sm text-slate-500">{word.vietnamese_meaning}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: Chi tiết từ vựng */}
        <div className="lg:col-span-8 h-full">
          {activeWord ? (
            <WordContent word={activeWord} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">Không tìm thấy từ vựng</div>
          )}
        </div>

      </div>
    </div>
  );
}