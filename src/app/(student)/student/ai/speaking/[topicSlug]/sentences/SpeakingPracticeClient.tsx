'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import stringSimilarity from 'string-similarity';
import { Sentence, EvaluationResult } from '@/types/ai-practice';
import { SentenceDisplay } from '@/components/student/ai/speaking/SentenceDisplay';
import { EvaluationFeedback } from '@/components/student/ai/speaking/EvaluationFeedback';
import { PracticeControls } from '@/components/student/ai/speaking/PracticeControls';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

interface Props {
  sentences: Sentence[];
  topicName: string;
}

export default function SpeakingPracticeClient({ sentences, topicName }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const { isRecording, transcript, startRecording, stopRecording, resetTranscript, isSupported } = useSpeechRecognition('ru-RU');

  const currentSentence = sentences[currentIndex];
  const isLastSentence = currentIndex === sentences.length - 1;

  // Khi transcript có nội dung và kết thúc ghi âm, tự động chấm điểm
  useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeechLocally(transcript, currentSentence.russian_text);
    }
  }, [isRecording, transcript, currentSentence.russian_text]);

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
      // Dummy audio file to satisfy the current API (since the API expects an audio file)
      // Note: Ideally, you should update the API to accept text directly for AI analysis.
      // But for now, we'll construct a blob or we can just send the text.
      // Let's assume we modify the API or we just use text.
      // Actually, since we only need the API for AI fallback, let's just pass a dummy blob 
      // but append the transcript so the server can use it directly!
      const dummyBlob = new Blob(['dummy audio'], { type: 'audio/webm' });
      formData.append("audio", dummyBlob);
      formData.append("targetText", currentSentence.russian_text);
      formData.append("studentText", transcript); // Add transcript to bypass Whisper

      const response = await fetch("/api/evaluate-speech", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Lỗi API đánh giá");

      const data = await response.json();
      
      let combinedTip = data.feedback || "";
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        combinedTip += ` Lỗi phát âm: ${data.errors.join(", ")}.`;
      }

      setEvaluation({
        score: data.score,
        tip: combinedTip || "Phát âm tốt!", 
      });

    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gọi AI phân tích.");
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
      resetTranscript();
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
          isLastSentence={isLastSentence}
          evaluation={evaluation}
          onToggleRecording={toggleRecording}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}