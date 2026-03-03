import React from 'react';
import { Volume2, Info, MessageSquare, ListTree } from 'lucide-react';
import { DictionaryWord } from '@/types/dictionary';

export function WordContent({ word }: { word: DictionaryWord }) {
  
  // Hàm đọc text (TTS)
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full overflow-y-auto">
      
      {/* Header Từ vựng */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              {word.word_type}
            </span>
            {word.phonetic && (
              <span className="text-gray-400 font-mono text-sm">{word.phonetic}</span>
            )}
          </div>
          <h1 className="text-5xl font-extrabold text-[#1a202c] mb-2">{word.russian_word}</h1>
          <p className="text-xl text-[#f07b32] font-semibold">{word.vietnamese_meaning}</p>
        </div>
        
        <button 
          onClick={() => playAudio(word.russian_word)}
          className="w-14 h-14 bg-orange-50 text-[#f07b32] hover:bg-[#f07b32] hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Định nghĩa & Cách dùng */}
      {word.definition_usage && (
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-bold text-gray-800 mb-3">
            <Info size={20} className="text-[#f07b32] mr-2" />
            Định nghĩa & Cách dùng
          </h3>
          <div className="bg-gray-50 rounded-2xl p-5 text-gray-600 leading-relaxed text-[15px]">
            {word.definition_usage}
          </div>
        </div>
      )}

      {/* Ví dụ mẫu câu */}
      {word.examples && word.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4">
            <MessageSquare size={20} className="text-[#f07b32] mr-2" />
            Ví dụ mẫu câu
          </h3>
          <div className="space-y-3">
            {word.examples.map((ex, idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center group hover:border-orange-200 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">RU</span>
                    <p className="text-gray-800 font-medium">{ex.ru}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">VN</span>
                    <p className="text-gray-500 text-sm">{ex.vn}</p>
                  </div>
                </div>
                <button 
                  onClick={() => playAudio(ex.ru)}
                  className="text-gray-400 hover:text-[#f07b32] p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cấu trúc ngữ pháp */}
      {word.grammar_structure && word.grammar_structure.length > 0 && (
        <div>
          <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4">
            <ListTree size={20} className="text-[#f07b32] mr-2" />
            Cấu trúc ngữ pháp liên quan
          </h3>
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {word.grammar_structure.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 last:border-0 text-sm">
                <div className="font-semibold text-gray-700">{row.col1}</div>
                <div className="text-gray-600">{row.col2}</div>
                <div className="text-gray-600">{row.col3}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}