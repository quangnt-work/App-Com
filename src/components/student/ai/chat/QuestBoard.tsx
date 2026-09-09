'use client';

import React from 'react';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { RoleplayObjective } from '@/types/ai-chat';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HintState {
  [objectiveId: string]: 'vi' | 'ru';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuestBoardProps {
  context: string;
  objectives: RoleplayObjective[];
  completedObjectives: string[];
  hints: HintState;
  hintsUsed: number;
  isStarted: boolean;
  isAllCompleted: boolean;
  onRevealHint: (objectiveId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestBoard({
  context,
  objectives,
  completedObjectives,
  hints,
  hintsUsed,
  isStarted,
  isAllCompleted,
  onRevealHint,
}: QuestBoardProps) {
  return (
    <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 flex flex-col">
      <h3 className="font-extrabold text-slate-800 text-lg mb-4 border-b border-slate-100 pb-4 flex items-center justify-between">
        Bảng Nhiệm Vụ
        <span className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100/80 font-bold px-2 py-1 rounded-lg">
          {completedObjectives.length} / {objectives.length}
        </span>
      </h3>
      <p className="text-sm text-slate-500 mb-6 italic">{context}</p>

      <div className="flex-1 overflow-y-auto space-y-3">
        {objectives.map((obj) => {
          const isDone = completedObjectives.includes(obj.id);
          const hintLevel = hints[obj.id];

          return (
            <div key={obj.id} className={`p-3 rounded-2xl border transition-all ${
              isDone ? 'bg-emerald-50/70 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isDone
                    ? <CheckCircle2 className="text-emerald-500" size={18} />
                    : <Circle className="text-slate-300" size={18} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isDone ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-600'}`}>
                    {obj.description}
                  </div>

                  {/* Hints */}
                  {!isDone && hintLevel && (
                    <div className="mt-2 space-y-1 animate-in fade-in duration-200">
                      <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                        🇻🇳 {obj.hint_vi}
                      </div>
                      {hintLevel === 'ru' && (
                        <div className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 font-medium">
                          🇷🇺 {obj.hint_ru}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hint button */}
                {!isDone && isStarted && (
                  <button
                    onClick={() => onRevealHint(obj.id)}
                    disabled={hintLevel === 'ru'}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      hintLevel === 'ru'
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-amber-50 text-amber-500 hover:bg-amber-100 border border-amber-200'
                    }`}
                    title={!hintLevel ? 'Gợi ý tiếng Việt' : hintLevel === 'vi' ? 'Gợi ý tiếng Nga' : 'Đã hiện hết'}
                  >
                    <Lightbulb size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hints used counter */}
      {hintsUsed > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 border-dashed text-xs text-amber-600 font-medium text-center">
          💡 Đã dùng {hintsUsed} gợi ý {hintsUsed > 3 && '(ảnh hưởng số ⭐)'}
        </div>
      )}

      {isAllCompleted && (
        <div className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl text-center font-bold shadow-md shadow-emerald-500/20 animate-bounce">
          🎉 Hoàn Thành Kịch Bản!
        </div>
      )}
    </div>
  );
}
