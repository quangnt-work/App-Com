import React from 'react';
import { EvaluationResult } from '@/types/ai-practice';

interface EvaluationFeedbackProps {
  evaluation: EvaluationResult | null;
}

export function EvaluationFeedback({ evaluation }: EvaluationFeedbackProps) {
  if (!evaluation) return null;

  const isPassed = evaluation.score >= 8;

  return (
    <div className={`w-full p-4 rounded-xl mb-8 text-left animate-in fade-in slide-in-from-bottom-4 ${
      isPassed ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-2xl font-black ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
          {evaluation.score}/10
        </span>
        <span className={`font-semibold ${isPassed ? 'text-green-700' : 'text-orange-700'}`}>
          {isPassed ? "Tuyệt vời!" : "Cần cố gắng thêm"}
        </span>
      </div>
      <p className="text-gray-700 text-sm"><strong>Tip:</strong> {evaluation.tip}</p>
    </div>
  );
}