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
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-10">

      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        
        {/* CỘT TRÁI: Danh sách từ vựng */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          {/* Thanh tìm kiếm */}
          <div className="p-5 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm từ vựng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>

          {/* Danh sách List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
            {filteredWords.map((word) => {
              const isActive = word.id === activeWordId;
              return (
                <button
                  key={word.id}
                  onClick={() => setActiveWordId(word.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-orange-50 border border-orange-100 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <h4 className={`text-lg font-bold mb-1 ${isActive ? 'text-[#f07b32]' : 'text-gray-800'}`}>
                    {word.russian_word}
                  </h4>
                  <p className="text-sm text-gray-500">{word.vietnamese_meaning}</p>
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
            <div className="h-full flex items-center justify-center text-gray-400">Không tìm thấy từ vựng</div>
          )}
        </div>

      </div>
    </div>
  );
}