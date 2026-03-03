// src/components/student/ai/chat/ChatMessage.tsx
'use client';

import React from 'react';
import { ChatMessageType } from "@/types/ai-chat";
import { Volume2 } from 'lucide-react';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isModel = message.role === 'model';

  // Tích hợp luôn hàm đọc âm thanh vào trong Component này
  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Giọng Nga
    utterance.rate = 0.9;     // Tốc độ vừa phải
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-6 animate-in slide-in-from-bottom-2`}>
      <div 
        className={`p-4 rounded-3xl max-w-[75%] leading-relaxed ${
          isModel 
            ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100' // Bong bóng chat của AI (Màu trắng, đuôi nhọn bên trái)
            : 'bg-[#f07b32] text-white rounded-br-sm shadow-md' // Bong bóng chat của User (Màu cam, đuôi nhọn bên phải)
        }`}
      >
        {/* Nội dung tin nhắn */}
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {/* Nút Nghe phát âm - CHỈ HIỂN THỊ QUẢ BÓNG CỦA AI */}
        {isModel && (
          <button 
            onClick={() => playAudio(message.content)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100 w-fit"
          >
            <Volume2 size={16} /> Nghe phát âm
          </button>
        )}
      </div>
    </div>
  );
}