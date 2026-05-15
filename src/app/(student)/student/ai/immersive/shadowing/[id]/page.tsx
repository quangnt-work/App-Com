'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic, Volume2, Square, ArrowRight, EyeOff } from 'lucide-react';
import shadowingData from '@/data/shadowing.json';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import stringSimilarity from 'string-similarity';
import { toast } from 'sonner';

export default function ShadowingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  const topic = shadowingData.find(t => t.id === topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [showText, setShowText] = useState(true); // Biến để kiểm soát việc mở chữ khi đã nói xong
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { isRecording, transcript, startRecording, stopRecording, resetTranscript, isSupported } = useSpeechRecognition('ru-RU');

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!topic) {
      router.push('/student/ai/immersive/shadowing');
    }
  }, [topic, router]);

  if (!topic) return null;

  const currentSentence = topic.sentences[currentIndex];
  const isBlindMode = currentIndex >= 5; // Từ câu 6 trở đi che chữ

  // Reset state mỗi khi sang câu mới
  useEffect(() => {
    setScore(null);
    setShowText(!isBlindMode);
    resetTranscript();
    // Tự động đọc câu mẫu khi vừa sang câu mới
    setTimeout(() => playAudio(), 500);
  }, [currentIndex]);

  // Chấm điểm khi có kết quả transcript
  useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeechLocally(transcript, currentSentence.ru);
    }
  }, [isRecording, transcript]);

  const playAudio = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSentence.ru);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
  };

  const evaluateSpeechLocally = (studentText: string, targetText: string) => {
    if (!studentText.trim()) return;

    const normalize = (str: string) => str.toLowerCase().replace(/[.,!?;:"']/g, '').trim();
    const similarity = stringSimilarity.compareTwoStrings(normalize(targetText), normalize(studentText));
    const calculatedScore = Math.round(similarity * 10);

    setScore(calculatedScore);
    setShowText(true); // Hiện chữ lên để học viên đối chiếu

    if (calculatedScore >= 8) {
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(currentMax => Math.max(currentMax, newCombo));
        return newCombo;
      });
      toast.success('Tuyệt vời! +1 Combo', { position: 'top-center' });
    } else {
      setCombo(0);
      toast.error('Chưa chính xác lắm, hãy thử lại!', { position: 'top-center' });
    }
  };

  const handleNext = () => {
    if (currentIndex < topic.sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.");
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      setScore(null);
      resetTranscript();
      startRecording();
    }
  };

  const renderEvaluation = () => {
    let title = '';
    let message = '';
    let icon = '';

    if (maxCombo <= 2) {
      title = 'Lính mới nhập môn';
      message = 'Bạn mới bắt đầu làm quen với nhịp điệu. Hãy tập trung nghe kỹ hơn ở chế độ Blind Mode nhé!';
      icon = '🥉';
    } else if (maxCombo <= 5) {
      title = 'Phản xạ cơ bản';
      message = 'Khá khen! Lưỡi bạn đã bắt đầu mềm ra. Cố gắng duy trì phong độ này lâu hơn.';
      icon = '🥈';
    } else if (maxCombo <= 10) {
      title = 'Kẻ thách thức';
      message = 'Tuyệt vời! Bạn đang dần bắt được ngữ điệu chuẩn của người bản xứ. Tốc độ rất tốt!';
      icon = '🥇';
    } else if (maxCombo <= 15) {
      title = 'Chuyên gia nhại giọng';
      message = 'Đỉnh cao! Kỹ năng nghe và phản xạ của bạn thật đáng kinh ngạc.';
      icon = '💎';
    } else {
      title = 'Bậc thầy tiếng Nga';
      message = 'Hoàn hảo 100%! Không thể tin được, bạn chính là một cỗ máy nói tiếng Nga thực thụ!';
      icon = '👑';
    }

    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <div className="inline-block bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 mb-6">
          <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Chuỗi Combo dài nhất</p>
          <p className="text-4xl font-black text-blue-600">{maxCombo} <span className="text-xl text-blue-400">câu</span></p>
        </div>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">{message}</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCombo(0);
              setMaxCombo(0);
              setIsFinished(false);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Làm lại từ đầu
          </button>
          <button
            onClick={() => {
              if (window.history.length > 2) {
                router.back();
              } else {
                router.push('/student/ai/immersive/shadowing');
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Chọn chủ đề khác
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[800px]">
        {isFinished ? renderEvaluation() : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-4">
                <div className="bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-xl">
                  🔥 Combo: {combo}
                </div>
                <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl">
                  Câu {currentIndex + 1} / {topic.sentences.length}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center relative overflow-hidden">

          {isBlindMode && !showText && (
            <div className="absolute top-4 right-4 text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">
              <EyeOff size={14} /> BLIND MODE
            </div>
          )}

          <div className="mb-10 min-h-[160px] flex flex-col items-center justify-center">
            {showText ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
                  {currentSentence.ru}
                </h2>
                <p className="text-xl text-blue-600 font-medium">
                  {currentSentence.vi}
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-gray-300">
                  <EyeOff size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Câu này đã bị che. Hãy lắng nghe và lặp lại.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={playAudio}
              className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              title="Nghe lại"
            >
              <Volume2 size={28} />
            </button>

            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording
                  ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                }`}
              title={isRecording ? "Dừng ghi âm" : "Bấm để đọc"}
            >
              {isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
            </button>
          </div>

          {score !== null && (
            <div className="p-6 bg-gray-50 rounded-2xl mb-8 animate-in slide-in-from-bottom-4">
              <div className="text-sm text-gray-500 mb-2">Hệ thống nghe được:</div>
              <div className="text-xl font-medium text-gray-800 mb-4">"{transcript}"</div>
              <div className={`text-2xl font-bold ${score >= 8 ? 'text-green-500' : 'text-red-500'}`}>
                Điểm: {score}/10
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={isRecording}
            className="mx-auto flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {currentIndex === topic.sentences.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
            <ArrowRight size={20} />
          </button>

        </div>
          </>
        )}
      </main>
    </div>
  );
}
