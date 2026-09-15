// src/app/(student)/student/ai/speaking/[topicSlug]/sentences/SpeakingPracticeClient.tsx

'use client';

import React from 'react';
import { Sentence } from '@/types/ai-practice';
import { SentenceDisplay } from '@/components/student/ai/speaking/SentenceDisplay';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';
import { useSpeechPracticeSession } from '@/hooks/useSpeechPracticeSession';

interface Props {
  sentences: Sentence[];
  topicName: string;
}

export default function SpeakingPracticeClient({ sentences, topicName }: Props) {
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
    totalItems: sentences.length,
    getTargetText: (idx) => sentences[idx]?.russian_text || '',
    onCompleteRoute: `/student/ai/speaking/${topicName}`,
  });

  const currentSentence = sentences[currentIndex];

  if (!currentSentence) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center flex flex-col items-center border border-gray-100">
        
        <SentenceDisplay sentence={currentSentence} onPlayExample={() => playExample()} />
        
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