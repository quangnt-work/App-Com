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
  A1: { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200/70' },
  A2: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200/70' },
  B1: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200/70' },
  B2: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200/70' },
};

export function QuizProgress({ current, total, level, correctCount }: QuizProgressProps) {
  const progress = ((current) / total) * 100;
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.A1;

  return (
    <div className="space-y-3">
      {/* Top row: câu số / tổng + level badge + điểm */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-700">
            Câu {current + 1}/{total}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
            {level}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-emerald-600">✓ {correctCount}</span>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-400">{current}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
