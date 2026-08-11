'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, RotateCcw } from 'lucide-react';
import { RoleplayObjective } from '@/types/ai-chat';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function calculateStars(
  objectivesCompleted: number,
  totalObjectives: number,
  hintsUsed: number,
  timeSeconds: number
): number {
  const completionRatio = objectivesCompleted / totalObjectives;
  if (completionRatio < 0.5) return 1;

  let stars = 3;
  if (hintsUsed > 3) stars -= 1;
  if (hintsUsed > 6) stars -= 1;
  if (completionRatio < 1) stars -= 1;
  if (completionRatio === 1 && timeSeconds < 180 && hintsUsed === 0) stars = 3;

  return Math.max(1, Math.min(3, stars));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RoleplayEvaluationProps {
  topicTitle: string;
  objectives: RoleplayObjective[];
  completedObjectives: string[];
  hintsUsed: number;
  elapsedSeconds: number;
  onRestart: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RoleplayEvaluation({
  topicTitle,
  objectives,
  completedObjectives,
  hintsUsed,
  elapsedSeconds,
  onRestart,
}: RoleplayEvaluationProps) {
  const router = useRouter();
  const stars = calculateStars(completedObjectives.length, objectives.length, hintsUsed, elapsedSeconds);
  const percentage = Math.round((completedObjectives.length / objectives.length) * 100);

  let title = '';
  let message = '';

  if (percentage < 50) {
    title = 'Khách du lịch bỡ ngỡ';
    message = 'Giao tiếp còn khá hạn chế. Đừng ngại dùng gợi ý và thử lại nhé!';
  } else if (percentage < 100) {
    title = 'Người giao tiếp tự tin';
    message = 'Rất tốt! Bạn đã giải quyết được phần lớn vấn đề. Chỉ chút nữa là hoàn hảo.';
  } else {
    title = 'Người bản xứ thực thụ';
    message = 'Xuất sắc! Bạn đã xử lý tình huống cực kỳ mượt mà.';
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[800px]">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <Star
                key={i}
                size={48}
                className={i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                strokeWidth={1.5}
              />
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-400 text-sm mb-6">{topicTitle}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-[#f07b32]">{completedObjectives.length}/{objectives.length}</div>
              <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-1">Nhiệm vụ</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-blue-600">{formatTime(elapsedSeconds)}</div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-1">Thời gian</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-purple-600">{hintsUsed}</div>
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mt-1">Gợi ý</div>
            </div>
          </div>

          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">{message}</p>

          {hintsUsed > 0 && (
            <p className="text-sm text-amber-600 mb-6">
              💡 Bạn đã dùng {hintsUsed} gợi ý. Thử lại không dùng gợi ý để đạt 3 ⭐!
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Chơi lại
            </button>
            <button
              onClick={() => router.push('/student/ai/immersive/roleplay')}
              className="px-6 py-3 bg-[#f07b32] text-white font-bold rounded-xl hover:bg-[#e26a24] transition-colors"
            >
              Chọn kịch bản khác
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
