// src/components/student/ai/grammar/QuizResult.tsx
'use client';

import React from 'react';
import { GrammarQuizResult, GrammarLevel } from '@/types/ai-grammar';
import { Trophy, RotateCcw, ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuizResultProps {
  result: GrammarQuizResult;
  topicTitle: string;
  onRetry: () => void;
}

const LEVEL_CONFIG: Record<GrammarLevel, { label: string; color: string; bg: string }> = {
  A1: { label: 'A1 · Cơ bản', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  A2: { label: 'A2 · Sơ cấp', color: 'text-sky-600', bg: 'bg-sky-50' },
  B1: { label: 'B1 · Trung cấp', color: 'text-amber-600', bg: 'bg-amber-50' },
  B2: { label: 'B2 · Nâng cao', color: 'text-rose-600', bg: 'bg-rose-50' },
};

function getScoreMessage(percentage: number): { emoji: string; text: string; color: string } {
  if (percentage >= 90) return { emoji: '🏆', text: 'Xuất sắc!', color: 'text-emerald-600' };
  if (percentage >= 70) return { emoji: '🎉', text: 'Tốt lắm!', color: 'text-sky-600' };
  if (percentage >= 50) return { emoji: '💪', text: 'Khá tốt!', color: 'text-amber-600' };
  return { emoji: '📚', text: 'Cần cải thiện', color: 'text-red-500' };
}

export function QuizResult({ result, topicTitle, onRetry }: QuizResultProps) {
  const router = useRouter();
  const scoreMsg = getScoreMessage(result.percentage);

  // Tính circumference cho circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-sm border p-8 md:p-10 text-center mb-6">
        <p className="text-sm text-gray-400 font-medium mb-2">Kết quả luyện tập</p>
        <h2 className="text-xl font-bold text-gray-800 mb-8">{topicTitle}</h2>

        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160" aria-hidden="true" role="presentation">
            <circle cx="80" cy="80" r={radius} stroke="#f3f4f6" strokeWidth="10" fill="none" />
            <circle
              cx="80" cy="80" r={radius}
              stroke={result.percentage >= 70 ? '#10b981' : result.percentage >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-gray-800">{result.score}</span>
            <span className="text-sm text-gray-400 font-medium">/ {result.total}</span>
          </div>
        </div>

        {/* Score message */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">{scoreMsg.emoji}</span>
          <span className={`text-2xl font-extrabold ${scoreMsg.color}`}>{scoreMsg.text}</span>
        </div>
        <p className="text-gray-500 font-medium">{Math.round(result.percentage)}% chính xác</p>
      </div>

      {/* Level Breakdown */}
      <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} className="text-gray-400" />
          <h3 className="text-lg font-bold text-gray-800">Phân tích theo trình độ</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(result.levelBreakdown) as [GrammarLevel, { correct: number; total: number }][]).map(
            ([level, data]) => {
              const config = LEVEL_CONFIG[level];
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={level} className={`${config.bg} rounded-2xl p-4 border border-transparent`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                    <div className="flex items-center gap-1">
                      {pct >= 80 && <Star size={14} className="text-amber-400 fill-amber-400" />}
                      <span className={`text-sm font-bold ${config.color}`}>{data.correct}/{data.total}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* AI Feedback */}
      {result.feedback && (
        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h3 className="text-lg font-bold text-gray-800">Nhận xét từ AI</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{result.feedback}</p>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/student/ai/grammar')}
          className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Chọn chủ đề khác
        </button>
        <button
          onClick={onRetry}
          className="flex-1 bg-[#f07b32] hover:bg-[#d46522] text-white py-4 rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Làm lại
        </button>
      </div>
    </div>
  );
}
