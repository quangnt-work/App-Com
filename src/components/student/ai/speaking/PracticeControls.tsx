import React from 'react';
import { Mic, ChevronRight, Loader2, PlaySquare } from 'lucide-react';
import { EvaluationResult } from '@/types/ai-practice';

interface PracticeControlsProps {
  isRecording: boolean;
  isEvaluating: boolean;
  isLastSentence: boolean;
  evaluation: EvaluationResult | null;
  onToggleRecording: () => void;
  onNext: () => void;
}

export function PracticeControls({
  isRecording,
  isEvaluating,
  isLastSentence,
  evaluation,
  onToggleRecording,
  onNext
}: PracticeControlsProps) {
  const isPassed = evaluation && evaluation.score >= 8;

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 mt-auto">
      <button 
        onClick={onToggleRecording}
        disabled={isEvaluating}
        className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl font-semibold transition-all duration-300
          ${isRecording 
            ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-200' 
            : 'bg-[#e25c43] hover:bg-[#d44c33] text-white shadow-md'
          }
          ${isEvaluating ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isEvaluating ? <Loader2 className="animate-spin mb-1" size={24} /> : <Mic size={24} className="mb-1" />}
        {isEvaluating ? 'Đang chấm...' : isRecording ? 'Dừng thu âm' : 'Thu âm'}
      </button>

      <button 
        onClick={onNext}
        className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl font-semibold transition-all duration-300
          ${isPassed 
            ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md shadow-green-200' 
            : 'bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#3b82f6]' 
          }
        `}
      >
        {isLastSentence ? <PlaySquare size={24} className="mb-1" /> : <ChevronRight size={24} className="mb-1" />}
        {isLastSentence ? 'Kết thúc' : 'Tiếp theo'}
      </button>
    </div>
  );
}