'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ShadowingEvaluation, WordAnalysis } from '@/types/shadowing';

interface ShadowingResultProps {
  topicTitle: string;
  evaluations: (ShadowingEvaluation | null)[];
  maxCombo: number;
  totalAttempts: number;
  onRestart: () => void;
  onRetryWeak: (weakIndices: number[]) => void;
}

export function ShadowingResult({
  topicTitle,
  evaluations,
  maxCombo,
  totalAttempts,
  onRestart,
  onRetryWeak,
}: ShadowingResultProps) {
  const router = useRouter();

  // Calculate stats
  const stats = useMemo(() => {
    const validScores = evaluations.filter((e): e is ShadowingEvaluation => e !== null);
    const avgScore = validScores.length > 0
      ? validScores.reduce((sum, e) => sum + e.score, 0) / validScores.length
      : 0;
    const passedCount = validScores.filter(e => e.score >= 8).length;
    const weakIndices = evaluations
      .map((e, i) => (e && e.score < 7 ? i : -1))
      .filter(i => i !== -1);

    // Top wrong words
    const wrongWordMap = new Map<string, number>();
    validScores.forEach(e => {
      e.word_analysis
        .filter(w => w.status === 'wrong' || w.status === 'missing')
        .forEach(w => {
          const key = w.expected || w.word;
          wrongWordMap.set(key, (wrongWordMap.get(key) || 0) + 1);
        });
    });
    const topWrongWords = Array.from(wrongWordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { avgScore, passedCount, weakIndices, topWrongWords, total: evaluations.length };
  }, [evaluations]);

  // Chart data
  const chartData = evaluations.map((e, i) => ({
    name: `${i + 1}`,
    score: e?.score ?? 0,
  }));

  // Rank
  const rank = useMemo(() => {
    if (maxCombo >= 16) return { icon: '👑', title: 'Bậc thầy tiếng Nga', color: 'text-yellow-500' };
    if (maxCombo >= 11) return { icon: '💎', title: 'Chuyên gia nhại giọng', color: 'text-cyan-500' };
    if (maxCombo >= 6)  return { icon: '🥇', title: 'Kẻ thách thức', color: 'text-amber-500' };
    if (maxCombo >= 3)  return { icon: '🥈', title: 'Phản xạ cơ bản', color: 'text-gray-400' };
    return { icon: '🥉', title: 'Lính mới nhập môn', color: 'text-orange-400' };
  }, [maxCombo]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{rank.icon}</div>
        <h2 className={`text-3xl md:text-4xl font-extrabold ${rank.color} mb-2`}>{rank.title}</h2>
        <p className="text-gray-400 text-sm">{topicTitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-blue-600">{stats.avgScore.toFixed(1)}</div>
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-1">Điểm TB</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-orange-600">{maxCombo}</div>
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-1">Max Combo</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-green-600">{stats.passedCount}/{stats.total}</div>
          <div className="text-xs font-semibold text-green-400 uppercase tracking-wider mt-1">Câu đạt</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-purple-600">{totalAttempts}</div>
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mt-1">Lần thử</div>
        </div>
      </div>

      {/* Score Chart */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-8">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Điểm từng câu</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value ?? 0}/10`, 'Điểm']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 8 ? '#22c55e' : entry.score >= 5 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Wrong Words */}
      {stats.topWrongWords.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-4 mb-8">
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Từ cần ôn luyện</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topWrongWords.map(([word, count]) => (
              <span
                key={word}
                className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-sm font-medium"
              >
                {word} <span className="text-red-400">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {stats.weakIndices.length > 0 && (
          <button
            onClick={() => onRetryWeak(stats.weakIndices)}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            🔄 Luyện lại {stats.weakIndices.length} câu yếu
          </button>
        )}
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Làm lại từ đầu
        </button>
        <button
          onClick={() => router.replace('/student/ai/immersive/shadowing')}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Chọn chủ đề khác
        </button>
      </div>
    </div>
  );
}
