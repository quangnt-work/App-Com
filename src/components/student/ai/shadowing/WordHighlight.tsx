'use client';

import React from 'react';
import type { WordAnalysis } from '@/types/shadowing';

interface WordHighlightProps {
  words: WordAnalysis[];
}

const statusStyles: Record<WordAnalysis['status'], { bg: string; text: string; decoration?: string }> = {
  correct: { bg: 'bg-green-100', text: 'text-green-700' },
  wrong:   { bg: 'bg-red-100',   text: 'text-red-600' },
  missing: { bg: 'bg-yellow-100', text: 'text-yellow-700', decoration: 'line-through' },
  extra:   { bg: 'bg-gray-100',   text: 'text-gray-400', decoration: 'line-through' },
};

const statusLabels: Record<WordAnalysis['status'], string> = {
  correct: '✓ Đúng',
  wrong:   '✗ Sai',
  missing: '⚠ Thiếu',
  extra:   '… Thừa',
};

export function WordHighlight({ words }: WordHighlightProps) {
  if (!words || words.length === 0) return null;

  const playWord = async (word: string) => {
    // Dừng âm thanh đang phát
    if ((window as any).currentWordAudio) {
      (window as any).currentWordAudio.pause();
    }
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word, voice: 'ru-RU-DmitryNeural' }) // Giọng DmitryNeural
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      (window as any).currentWordAudio = audio;
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 justify-center py-3">
      {words.map((item, index) => {
        const style = statusStyles[item.status];
        const isError = item.status === 'wrong' || item.status === 'missing';
        const targetWord = item.expected || item.word;

        return (
          <span
            key={`${item.word}-${index}`}
            className="relative group cursor-pointer"
            onClick={() => isError ? playWord(targetWord) : playWord(item.word)}
            title="Nhấn để nghe phát âm chuẩn"
          >
            <span
              className={`inline-block px-2 py-1 rounded-lg text-base font-medium transition-all hover:scale-105 active:scale-95
                ${style.bg} ${style.text} ${style.decoration || ''}
              `}
            >
              {item.word}
            </span>

            {/* Tooltip for wrong/missing words */}
            {(item.status === 'wrong' || item.status === 'missing' || item.status === 'extra') && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {statusLabels[item.status]}
                {item.expected && (
                  <span className="block text-green-300 mt-0.5">→ {item.expected}</span>
                )}
                <span className="block text-gray-400 text-[10px] mt-1 text-center font-normal italic">(Click để nghe)</span>
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
