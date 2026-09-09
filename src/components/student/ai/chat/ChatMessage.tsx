// src/components/student/ai/chat/ChatMessage.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessageType } from "@/types/ai-chat";
import { Volume2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  autoPlay?: boolean; // Tự động phát âm thanh khi render
}

export function ChatMessage({ message, autoPlay = false }: ChatMessageProps) {
  const isModel = message.role === 'model';
  const hasAutoPlayed = useRef(false);

  // Hàm đọc âm thanh
  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Giọng Nga
    utterance.rate = 0.9;     // Tốc độ vừa phải
    window.speechSynthesis.speak(utterance);
  };

  // Auto-play audio khi tin nhắn AI mới được render
  useEffect(() => {
    if (isModel && autoPlay && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      // Delay nhỏ để đảm bảo UI đã render xong rồi mới phát
      const timer = setTimeout(() => {
        playAudio(message.content);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isModel, autoPlay, message.content]);

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-6 animate-in slide-in-from-bottom-2`}>
      <div 
        className={`p-4 rounded-3xl max-w-[75%] leading-relaxed ${
          isModel 
            ? 'bg-white text-slate-800 rounded-bl-xs shadow-xs border border-slate-200/80' // Bong bóng chat của AI
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-xs shadow-sm shadow-indigo-500/20' // Bong bóng chat của User
        }`}
      >
        {/* Nội dung tin nhắn */}
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {/* Nút Nghe phát âm - CHỈ HIỂN THỊ QUẢ BÓNG CỦA AI */}
        {isModel && (
          <button 
            onClick={() => playAudio(message.content)}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100 w-fit"
          >
            <Volume2 size={16} /> Nghe phát âm
          </button>
        )}
      </div>
    </div>
  );
}