// src/app/(student)/student/ai/speaking/[topicSlug]/vocabulary/VocabularyPracticeClient.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import stringSimilarity from 'string-similarity';
import { EvaluationResult } from '@/types/ai-practice';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';
import { Volume2 } from 'lucide-react';
import { DictionaryWord } from '@/types/dictionary';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

interface Props {
  vocabularies: DictionaryWord[];
  topicName: string;
}

export default function VocabularyPracticeClient({ vocabularies, topicName }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const { isRecording, transcript, startRecording, stopRecording, resetTranscript, isSupported } = useSpeechRecognition('ru-RU');

  const currentWord = vocabularies[currentIndex];
  const isLastWord = currentIndex === vocabularies.length - 1;

  useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeechLocally(transcript, currentWord.russian_word);
    }
  }, [isRecording, transcript, currentWord.russian_word]);

  const evaluateSpeechLocally = (studentText: string, targetText: string) => {
    if (!studentText.trim()) return;

    setIsEvaluating(true);
    
    // Chuẩn hoá chuỗi: xoá dấu câu và đưa về chữ thường
    const normalize = (str: string) => str.toLowerCase().replace(/[.,!?;:"']/g, '').trim();
    
    const normalizedTarget = normalize(targetText);
    const normalizedStudent = normalize(studentText);

    // Tính độ tương đồng
    const similarity = stringSimilarity.compareTwoStrings(normalizedTarget, normalizedStudent);
    const score = Math.round(similarity * 10); // Thang điểm 10

    let tip = '';
    if (score >= 8) {
      tip = `Rất tốt! Hệ thống nghe thấy: "${studentText}"`;
    } else if (score >= 5) {
      tip = `Khá tốt, nhưng chưa hoàn hảo. Hệ thống nghe thấy: "${studentText}"`;
    } else {
      tip = `Hãy thử lại. Hệ thống nghe thấy: "${studentText}"`;
    }

    setEvaluation({
      score,
      tip,
    });
    
    setIsEvaluating(false);
  };

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome/Edge.");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      resetTranscript();
      setEvaluation(null);
      startRecording();
    }
  };

  const requestAiAnalysis = async () => {
    if (!transcript) return;
    setIsEvaluating(true);
    try {
      const formData = new FormData();
      const dummyBlob = new Blob(['dummy audio'], { type: 'audio/webm' });
      formData.append('audio', dummyBlob);
      formData.append('targetText', currentWord.russian_word);
      formData.append('studentText', transcript); // Send transcript directly to bypass Whisper

      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Mã lỗi HTTP: ${res.status}`);
      }

      const data = await res.json();

      let combinedTip = data.feedback || '';
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        combinedTip += ` Lỗi phát âm: ${data.errors.join(', ')}.`;
      }

      setEvaluation({
        score: data.score,
        tip: combinedTip || 'Phát âm tốt!',
      });
    } catch (error) {
      console.error(error);
      toast.error(`AI không thể chấm điểm. Vui lòng thử lại. (${error instanceof Error ? error.message : 'Lỗi không xác định'})`);
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
      resetTranscript();
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
            onClick={playExample}
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
          isLastSentence={isLastWord}
          evaluation={evaluation}
          onToggleRecording={toggleRecording}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}