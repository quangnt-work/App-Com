'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Languages, AlertCircle } from 'lucide-react';

interface RoleplayMessageProps {
  role: 'user' | 'model';
  content: string;
  replyVi?: string | null;    // Bản dịch tiếng Việt (chỉ model)
  correction?: string | null; // Sửa lỗi ngữ pháp (chỉ sau user message)
  autoPlayAudio?: boolean;
}

export function RoleplayMessage({ role, content, replyVi, correction, autoPlayAudio = false }: RoleplayMessageProps) {
  const isModel = role === 'model';
  const [showTranslation, setShowTranslation] = useState(false);
  const hasAutoPlayed = useRef(false);

  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isModel && autoPlayAudio && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      const timer = setTimeout(() => playAudio(content), 300);
      return () => clearTimeout(timer);
    }
  }, [isModel, autoPlayAudio, content]);

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-4 animate-in slide-in-from-bottom-2`}>
      <div className="max-w-[80%]">
        {/* Chat Bubble */}
        <div
          className={`p-4 rounded-3xl leading-relaxed ${
            isModel
              ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
              : 'bg-[#f07b32] text-white rounded-br-sm shadow-md'
          }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>

          {/* Model: Audio + Translation buttons */}
          {isModel && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => playAudio(content)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100"
              >
                <Volume2 size={14} /> Nghe
              </button>
              {replyVi && (
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-xl border ${
                    showTranslation
                      ? 'text-green-700 bg-green-100 border-green-200'
                      : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <Languages size={14} /> {showTranslation ? 'Ẩn dịch' : 'Xem dịch'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Translation (collapsible) */}
        {isModel && showTranslation && replyVi && (
          <div className="mt-2 ml-2 p-3 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-800 animate-in fade-in slide-in-from-top-2 duration-200">
            🇻🇳 {replyVi}
          </div>
        )}

        {/* Grammar Correction (after user message) */}
        {correction && (
          <div className="mt-2 mr-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
              <AlertCircle size={14} /> Sửa lỗi
            </div>
            <p className="text-amber-800">{correction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
