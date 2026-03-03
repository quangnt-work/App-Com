import React from 'react';
import { Volume2 } from 'lucide-react';
import { Sentence } from '@/types/ai-practice';

interface SentenceDisplayProps {
  sentence: Sentence;
  onPlayExample: () => void;
}

export function SentenceDisplay({ sentence, onPlayExample }: SentenceDisplayProps) {
  return (
    <>
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a202c] mb-4 tracking-tight">
        {sentence.russian_text}
      </h2>
      <p className="text-[#3b82f6] text-lg md:text-xl font-medium tracking-widest mb-4">
        {sentence.phonetic}
      </p>
      <div className="bg-[#f8fafc] text-gray-600 px-6 py-2 rounded-xl text-base md:text-lg mb-8 inline-block">
        {sentence.vietnamese_text}
      </div>

      <div className="w-full border-2 border-dashed border-[#cbd5e1] rounded-2xl p-6 mb-8 bg-[#f8fafc]/50">
        <p className="text-gray-500 mb-4">Bấm mic, đọc to và bấm dừng.</p>
        <button 
          onClick={onPlayExample}
          className="flex items-center justify-center mx-auto text-[#2563eb] font-semibold hover:text-blue-700 transition-colors"
        >
          <Volume2 size={20} className="mr-2" />
          Nghe mẫu
        </button>
      </div>
    </>
  );
}