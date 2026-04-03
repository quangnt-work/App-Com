// src/components/student/ai/grammar/QuizProgress.tsx
'use client';

import React from 'react';
import { GrammarLevel } from '@/types/ai-grammar';

interface QuizProgressProps {
  current: number;
  total: number;
  level: GrammarLevel;
  correctCount: number;
}

const LEVEL_COLORS: Record<GrammarLevel, { bg: string; text: string; ring: string }> = {
  A1: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  A2: { bg: 'bg-sky-100', text: 'text-sky-700', ring: 'ring-sky-200' },
  B1: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200' },
  B2: { bg: 'bg-rose-100', text: 'text-rose-700', ring: 'ring-rose-200' },
};

export function QuizProgress({ current, total, level, correctCount }: QuizProgressProps) {
  const progress = ((current) / total) * 100;
  const colors = LEVEL_COLORS[level];

  return (
    <div className="space-y-3">
      {/* Top row: câu số / tổng + level badge + điểm */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">
            Câu {current + 1}/{total}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
            {level}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-emerald-600">✓ {correctCount}</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400">{current}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#f07b32] to-[#f9a825] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
