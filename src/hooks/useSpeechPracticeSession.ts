'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import stringSimilarity from 'string-similarity';
import { EvaluationResult } from '@/types/ai-practice';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

interface UseSpeechPracticeSessionOptions {
  totalItems: number;
  getTargetText: (index: number) => string;
  onCompleteRoute?: string;
}

export function useSpeechPracticeSession({
  totalItems,
  getTargetText,
  onCompleteRoute,
}: UseSpeechPracticeSessionOptions) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const {
    isRecording,
    transcript,
    audioBlob,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition('ru-RU');

  const currentTargetText = getTargetText(currentIndex) || '';
  const isLastItem = currentIndex === totalItems - 1;

  const evaluateSpeechLocally = useCallback((studentText: string, targetText: string) => {
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
  }, []);

  useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeechLocally(transcript, currentTargetText);
    }
  }, [isRecording, transcript, currentTargetText, evaluateSpeechLocally]);

  const toggleRecording = useCallback(() => {
    if (!isSupported) {
      toast.error('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome/Edge.');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      resetTranscript();
      setEvaluation(null);
      startRecording();
    }
  }, [isSupported, isRecording, stopRecording, resetTranscript, startRecording]);

  const requestAiAnalysis = useCallback(async () => {
    if (!transcript && !audioBlob) return;
    setIsEvaluating(true);
    try {
      const formData = new FormData();
      if (audioBlob && audioBlob.size > 0) {
        formData.append('audio', audioBlob, 'recording.webm');
      }
      formData.append('targetText', currentTargetText);
      if (transcript) {
        formData.append('studentText', transcript);
      }

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
      if (data.stress_guide) {
        combinedTip += ` Trọng âm chuẩn: "${data.stress_guide}".`;
      }
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        combinedTip += ` Lỗi phát âm: ${data.errors.join(', ')}.`;
      }

      setEvaluation({
        score: data.score,
        tip: combinedTip || 'Phát âm rất tốt!',
      });
    } catch (error) {
      console.error(error);
      toast.error(
        `AI không thể chấm điểm. Vui lòng thử lại. (${
          error instanceof Error ? error.message : 'Lỗi không xác định'
        })`
      );
    } finally {
      setIsEvaluating(false);
    }
  }, [transcript, audioBlob, currentTargetText]);

  const handleNext = useCallback(() => {
    if (isLastItem) {
      if (onCompleteRoute) {
        router.replace(onCompleteRoute);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setEvaluation(null);
      resetTranscript();
    }
  }, [isLastItem, onCompleteRoute, router, resetTranscript]);

  const playExample = useCallback(
    (textToSpeak?: string) => {
      const text = textToSpeak ?? currentTargetText;
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    },
    [currentTargetText]
  );

  return {
    currentIndex,
    setCurrentIndex,
    isLastItem,
    isEvaluating,
    evaluation,
    isRecording,
    transcript,
    toggleRecording,
    requestAiAnalysis,
    handleNext,
    playExample,
  };
}
