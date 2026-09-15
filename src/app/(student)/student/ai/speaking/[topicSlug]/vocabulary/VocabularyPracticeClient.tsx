// src/app/(student)/student/ai/speaking/[topicSlug]/vocabulary/VocabularyPracticeClient.tsx

'use client';

import React from 'react';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';
import { Volume2 } from 'lucide-react';
import { DictionaryWord } from '@/types/dictionary';
import { useSpeechPracticeSession } from '@/hooks/useSpeechPracticeSession';

interface Props {
  vocabularies: DictionaryWord[];
  topicName: string;
}

export default function VocabularyPracticeClient({ vocabularies, topicName }: Props) {
  const {
    currentIndex,
    isLastItem,
    isEvaluating,
    evaluation,
    isRecording,
    toggleRecording,
    requestAiAnalysis,
    handleNext,
    playExample,
  } = useSpeechPracticeSession({
    totalItems: vocabularies.length,
    getTargetText: (idx) => vocabularies[idx]?.russian_word || '',
    onCompleteRoute: `/student/ai/speaking/${topicName}`,
  });

  const currentWord = vocabularies[currentIndex];

  if (!currentWord) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center flex flex-col items-center border border-gray-100">

        {/* Khối hiển thị Từ vựng */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a202c] mb-4 tracking-tight">
          {currentWord.russian_word}
        </h2>
        <p className="text-[#3b82f6] text-lg md:text-xl font-medium tracking-widest mb-4">
          /{currentWord.phonetic}/
        </p>
        <div className="bg-[#f8fafc] text-gray-600 px-6 py-2 rounded-xl text-base md:text-lg mb-8 inline-block">
          {currentWord.vietnamese_meaning}
        </div>
        <div className="w-full border-2 border-dashed border-[#cbd5e1] rounded-2xl p-6 mb-8 bg-[#f8fafc]/50">
          <p className="text-gray-500 mb-4">Bấm mic, đọc to và bấm dừng.</p>
          <button
            onClick={() => playExample()}
            className="flex items-center justify-center mx-auto text-[#2563eb] font-semibold hover:text-blue-700 transition-colors"
          >
            <Volume2 size={20} className="mr-2" />
            Nghe mẫu
          </button>
        </div>

        <EvaluationFeedback evaluation={evaluation} />
        
        {evaluation && evaluation.score < 8 && (
           <button 
             onClick={requestAiAnalysis} 
             disabled={isEvaluating}
             className="mb-6 text-sm text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
           >
             Hỏi AI chi tiết lỗi sai
           </button>
        )}

        <PracticeControls
          isRecording={isRecording}
          isEvaluating={isEvaluating}
          isLastSentence={isLastItem}
          evaluation={evaluation}
          onToggleRecording={toggleRecording}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}