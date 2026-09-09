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
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 h-full overflow-y-auto">
      
      {/* Header Từ vựng */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100/80 text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              {word.word_type}
            </span>
            {word.phonetic && (
              <span className="text-slate-400 font-mono text-sm">{word.phonetic}</span>
            )}
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-2">{word.russian_word}</h1>
          <p className="text-xl text-indigo-600 font-semibold">{word.vietnamese_meaning}</p>
        </div>
        
        <button 
          onClick={() => playAudio(word.russian_word)}
          className="w-14 h-14 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Định nghĩa & Cách dùng */}
      {word.definition_usage && (
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-bold text-slate-800 mb-3">
            <Info size={20} className="text-indigo-600 mr-2" />
            Định nghĩa & Cách dùng
          </h3>
          <div className="bg-slate-50 rounded-2xl p-5 text-slate-600 leading-relaxed text-[15px] border border-slate-100">
            {word.definition_usage}
          </div>
        </div>
      )}

      {/* Ví dụ mẫu câu */}
      {word.examples && word.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
            <MessageSquare size={20} className="text-indigo-600 mr-2" />
            Ví dụ mẫu câu
          </h3>
          <div className="space-y-3">
            {word.examples.map((ex, idx) => (
              <div key={idx} className="border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center group hover:border-indigo-300 hover:shadow-xs transition-all">
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100/80 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">RU</span>
                    <p className="text-slate-800 font-medium">{ex.ru}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200/60 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">VN</span>
                    <p className="text-slate-500 text-sm">{ex.vn}</p>
                  </div>
                </div>
                <button 
                  onClick={() => playAudio(ex.ru)}
                  className="text-slate-400 hover:text-indigo-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
            <ListTree size={20} className="text-indigo-600 mr-2" />
            Cấu trúc ngữ pháp liên quan
          </h3>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80">
            {word.grammar_structure.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 border-b border-slate-200/70 last:border-0 text-sm">
                <div className="font-semibold text-slate-700">{row.col1}</div>
                <div className="text-slate-600">{row.col2}</div>
                <div className="text-slate-600">{row.col3}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}