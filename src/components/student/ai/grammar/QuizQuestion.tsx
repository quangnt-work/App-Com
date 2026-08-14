// src/components/student/ai/grammar/QuizQuestion.tsx
'use client';

import React from 'react';
import { GrammarQuestion, GrammarLevel } from '@/types/ai-grammar';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface QuizQuestionProps {
  question: GrammarQuestion;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isAnswered: boolean;
}

const LEVEL_LABELS: Record<GrammarLevel, string> = {
  A1: 'Cơ bản',
  A2: 'Sơ cấp',
  B1: 'Trung cấp',
  B2: 'Nâng cao',
};

export function QuizQuestion({ question, selectedIndex, onSelect, isAnswered }: QuizQuestionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Câu hỏi */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
          {LEVEL_LABELS[question.level]} · {question.level}
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* 4 đáp án */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correctIndex;

          let optionClass = 'bg-white border-gray-200 hover:border-[#f07b32] hover:bg-orange-50/50 cursor-pointer';

          if (isAnswered) {
            if (isCorrect) {
              optionClass = 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200';
            } else if (isSelected && !isCorrect) {
              optionClass = 'bg-red-50 border-red-300 ring-1 ring-red-200';
            } else {
              optionClass = 'bg-gray-50 border-gray-100 opacity-60';
            }
          } else if (isSelected) {
            optionClass = 'bg-orange-50 border-[#f07b32] ring-2 ring-orange-200';
          }

          return (
            <button
              key={index}
              onClick={() => !isAnswered && onSelect(index)}
              aria-disabled={isAnswered}
              className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${optionClass}`}
            >
              {/* Label A/B/C/D */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-200
                ${isAnswered && isCorrect ? 'bg-emerald-500 text-white' :
                  isAnswered && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                  isSelected ? 'bg-[#f07b32] text-white' :
                  'bg-gray-100 text-gray-500'}`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option text */}
              <span className={`flex-1 text-base md:text-lg font-medium
                ${isAnswered && isCorrect ? 'text-emerald-800' :
                  isAnswered && isSelected && !isCorrect ? 'text-red-800 line-through' :
                  'text-gray-700'}`}
              >
                {option}
              </span>

              {/* Icon đúng/sai */}
              {isAnswered && isCorrect && (
                <CheckCircle2 size={24} className="text-emerald-500 flex-shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle size={24} className="text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Giải thích (hiện sau khi trả lời) */}
      {isAnswered && question.explanation && (
        <div className="mt-6 p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-700 mb-1">Giải thích</p>
              <p className="text-sm text-amber-900 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
