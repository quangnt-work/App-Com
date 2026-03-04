// src/app/(student)/student/ai/speaking/[topicSlug]/vocabulary/VocabularyPracticeClient.tsx

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EvaluationResult } from '@/types/ai-practice';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';
import { Volume2 } from 'lucide-react';
import { DictionaryWord } from '@/types/dictionary';


interface Props {
  vocabularies: DictionaryWord[]; 
  topicName: string;
}

export default function VocabularyPracticeClient({ vocabularies, topicName }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentWord = vocabularies[currentIndex];
  const isLastWord = currentIndex === vocabularies.length - 1;

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
      formData.append('targetText', currentWord.russian_word); 

      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
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
    if (isLastWord) {
      router.push(`/student/ai/speaking/${topicName}`); 
    } else {
      setCurrentIndex(prev => prev + 1);
      setEvaluation(null); 
    }
  };

  const playExample = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.russian_word);
    utterance.lang = 'ru-RU'; 
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center flex flex-col items-center border border-gray-100">
        
        {/* Khối hiển thị Từ vựng (Thay cho SentenceDisplay để tối ưu hiển thị 1 từ) */}
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
            onClick={playExample}
            className="flex items-center justify-center mx-auto text-[#2563eb] font-semibold hover:text-blue-700 transition-colors"
          >
            <Volume2 size={20} className="mr-2" />
            Nghe mẫu
          </button>
        </div>
        
        <EvaluationFeedback evaluation={evaluation} />

        <PracticeControls 
          isRecording={isRecording}
          isEvaluating={isEvaluating}
          isLastSentence={isLastWord}
          evaluation={evaluation}
          onToggleRecording={toggleRecording}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}