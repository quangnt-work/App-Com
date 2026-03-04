//src/app/(student)/student/ai/speaking/[topicSlug]/sentences/SpeakingPracticeClient.tsx

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sentence, EvaluationResult } from '@/types/ai-practice';
import { SentenceDisplay } from '@/components/student/ai/speaking/SentenceDisplay';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';

interface Props {
  sentences: Sentence[];
  topicName: string;
}

export default function SpeakingPracticeClient({ sentences, topicName }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentSentence = sentences[currentIndex];
  const isLastSentence = currentIndex === sentences.length - 1;

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await evaluateAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setEvaluation(null); 
      } catch (err) {
        alert("Vui lòng cấp quyền sử dụng Micro để luyện nói.");
      }
    }
  };

  const evaluateAudio = async (blob: Blob) => {
    setIsEvaluating(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('targetText', currentSentence.russian_text);

      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
  const errorData = await res.json().catch(() => ({}));
  // LOG RA CONSOLE ĐỂ XEM LỖI THẬT SỰ TỪ GOOGLE LÀ GÌ
  console.error("Lỗi từ Server API:", errorData); 
  throw new Error(errorData.error || `Mã lỗi HTTP: ${res.status}`);
}
      const data: EvaluationResult = await res.json();
      setEvaluation(data);
    } catch (error) {
      console.error(error);
      alert(`AI không thể chấm điểm. Vui lòng thử lại. (${error instanceof Error ? error.message : 'Lỗi không xác định'})`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (isLastSentence) {
      router.push(`/student/ai/speaking/${topicName}`); 
    } else {
      setCurrentIndex(prev => prev + 1);
      setEvaluation(null); 
    }
  };

  const playExample = () => {
    const utterance = new SpeechSynthesisUtterance(currentSentence.russian_text);
    utterance.lang = 'ru-RU'; 
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center flex flex-col items-center border border-gray-100">
        
        <SentenceDisplay sentence={currentSentence} onPlayExample={playExample} />
        
        <EvaluationFeedback evaluation={evaluation} />

        <PracticeControls 
          isRecording={isRecording}
          isEvaluating={isEvaluating}
          isLastSentence={isLastSentence}
          evaluation={evaluation}
          onToggleRecording={toggleRecording}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}