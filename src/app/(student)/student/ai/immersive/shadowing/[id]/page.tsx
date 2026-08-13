'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mic, Volume2, Square, ArrowRight, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import shadowingData from '@/data/shadowing.json';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useShadowingSession } from '@/hooks/useShadowingSession';
import { SpeedControl } from '@/components/student/ai/shadowing/SpeedControl';
import { WordHighlight } from '@/components/student/ai/shadowing/WordHighlight';
import { ShadowingResult } from '@/components/student/ai/shadowing/ShadowingResult';
import { AudioVisualizer } from '@/components/student/ai/shadowing/AudioVisualizer';

import type { SpeechSpeed, ShadowingSentence } from '@/types/shadowing';
import { SPEED_CONFIG } from '@/types/shadowing';

export default function ShadowingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  
  const [topic, setTopic] = useState<any>(null);
  const [sentences, setSentences] = useState<ShadowingSentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Topic và Sentences từ DB (hoặc JSON fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        
        // 1. Thử fetch Topic từ DB
        const { data: topicData, error: topicError } = await supabase
          .from('shadowing_topics')
          .select('*')
          .eq('id', topicId)
          .single();
          
        if (!topicError && topicData) {
          setTopic(topicData);
          
          const { data: sentencesData, error: sentencesError } = await supabase
            .from('shadowing_sentences')
            .select('*')
            .eq('topic_id', topicId)
            .order('order_index', { ascending: true });
            
          if (sentencesError) throw sentencesError;
          setSentences(sentencesData as any);
        } else {
          // Fallback: Tìm trong JSON
          const jsonTopic = shadowingData.find(t => t.id === topicId);
          if (jsonTopic) {
             setTopic(jsonTopic);
             setSentences(jsonTopic.sentences as any);
          } else {
             throw new Error("Không tìm thấy chủ đề trong cả DB và JSON.");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Không tìm thấy bài học này.');
        router.push('/student/ai/immersive/shadowing');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (topicId) {
      loadData();
    }
  }, [topicId, router]);

  const {
    currentIndex,
    currentSentence,
    isBlindMode,
    totalSentences,
    currentPosition,
    isFinished,
    session,
    isEvaluating,
    currentEvaluation,
    setCurrentEvaluation,
    showHint,
    failuresOnCurrent,
    handleEvaluation,
    handleNext,
    handleRestart,
    handleRetryWeak,
  } = useShadowingSession(sentences);

  const [speed, setSpeed] = useState<SpeechSpeed>('normal');

  // Speech recognition
  const {
    isRecording,
    transcript,
    audioUrl,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition('ru-RU');

  // Removed old redirect effect, covered by loadData

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Reset state when moving to a new sentence
  useEffect(() => {
    setCurrentEvaluation(null);
    resetTranscript();

    // Auto-play audio for new sentence
    const timer = setTimeout(() => {
      if (currentSentence) {
        playAudio(currentSentence.ru, (currentSentence as any).audio_url);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Evaluate when recording stops and we have a transcript
  useEffect(() => {
    if (!isRecording && transcript && currentSentence && !currentEvaluation) {
      handleEvaluation(transcript, currentSentence.ru);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, transcript]);

  const playAudio = useCallback(async (text: string, dbAudioUrl?: string) => {
    // Dừng âm thanh đang phát nếu có
    if ((window as any).currentAudio) {
      (window as any).currentAudio.pause();
    }
    
    // Ưu tiên file mp3 lưu trên Storage
    if (dbAudioUrl) {
       const audio = new Audio(dbAudioUrl);
       // Chỉnh tốc độ
       audio.playbackRate = SPEED_CONFIG[speed].rate;
       (window as any).currentAudio = audio;
       await audio.play().catch(e => console.error(e));
       return;
    }
    
    // Fallback: Nếu không có file mp3 thì tự sinh bằng API
    toast.promise(
      async () => {
        const rateNumber = SPEED_CONFIG[speed].rate;
        const edgeRate = rateNumber >= 1 
           ? `+${Math.round((rateNumber - 1) * 100)}%` 
           : `${Math.round((rateNumber - 1) * 100)}%`;
           
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, rate: edgeRate, voice: 'ru-RU-DmitryNeural' })
        });
        
        if (!res.ok) throw new Error('TTS failed');
        
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        (window as any).currentAudio = audio;
        await audio.play();
      },
      {
        loading: 'Đang tải giọng chuẩn...',
        success: 'Đang phát âm thanh 🔊',
        error: 'Lỗi tải giọng đọc mẫu',
      }
    );
  }, [speed]);

  const toggleRecording = useCallback(() => {
    if (!isSupported) {
      toast.error('Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.');
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      setCurrentEvaluation(null);
      resetTranscript();
      startRecording();
    }
  }, [isSupported, isRecording, stopRecording, resetTranscript, startRecording, setCurrentEvaluation]);

  // Render Guards
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="font-medium">Đang tải bài học...</p>
        </div>
      </div>
    );
  }
  
  if (!topic || !currentSentence) return null;

  // Finished State
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
        <main className="flex-1 container mx-auto px-4 py-8 max-w-[800px]">
          <ShadowingResult
            topicTitle={topic.title}
            evaluations={session.evaluations}
            maxCombo={session.maxCombo}
            totalAttempts={session.totalAttempts}
            onRestart={handleRestart}
            onRetryWeak={handleRetryWeak}
          />
        </main>
      </div>
    );
  }

  // Practice UI
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[800px]">

        {/* Top Bar: Combo + Progress + Speed */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex gap-3">
            <div className="bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-xl">
              🔥 Combo: {session.combo}
            </div>
            <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl">
              Câu {currentPosition + 1} / {totalSentences}
            </div>
          </div>
          <SpeedControl currentSpeed={speed} onSpeedChange={setSpeed} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center relative overflow-hidden">

          {/* Blind Mode Badge */}
          {!showHint && !currentEvaluation && (
            <div className="absolute top-4 right-4 text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">
              <EyeOff size={14} /> BLIND MODE
            </div>
          )}

          {/* Removed Adaptive Badge as it's full blind mode now */}

          {/* Sentence Display */}
          <div className="mb-10 min-h-[160px] flex flex-col items-center justify-center">
            {showHint || currentEvaluation ? (
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
                <p className="text-gray-500 font-medium">Lắng nghe Audio và lặp lại nhé.</p>
                {failuresOnCurrent > 0 && (
                  <p className="text-orange-500 text-sm mt-2 font-medium">
                    Bạn đã thử {failuresOnCurrent}/3 lần.
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Audio Visualizer */}
          <AudioVisualizer isRecording={isRecording} />

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => playAudio(currentSentence.ru, (currentSentence as any).audio_url)}
              className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              title={`Nghe lại (${SPEED_CONFIG[speed].label})`}
            >
              <Volume2 size={28} />
            </button>

            <button
              onClick={toggleRecording}
              disabled={isEvaluating}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all
                ${isEvaluating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isRecording
                    ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
                }`}
              title={isEvaluating ? 'Đang chấm...' : isRecording ? 'Dừng ghi âm' : 'Bấm để đọc'}
            >
              {isEvaluating ? (
                <Loader2 size={28} className="animate-spin" />
              ) : isRecording ? (
                <Square size={28} fill="currentColor" />
              ) : (
                <Mic size={32} />
              )}
            </button>
          </div>

          {/* Evaluation Result */}
          {currentEvaluation && (
            <div className="p-6 bg-gray-50 rounded-2xl mb-8 animate-in slide-in-from-bottom-4">
              {/* Source badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">Hệ thống nghe được:</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  currentEvaluation.evaluated_by === 'ai'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentEvaluation.evaluated_by === 'ai' ? '🤖 AI' : '📊 WER Offline'}
                </span>
              </div>

              <div className="text-xl font-medium text-gray-800 mb-4">
                &ldquo;{currentEvaluation.transcript}&rdquo;
              </div>

              {/* Word Highlight */}
              {currentEvaluation.word_analysis.length > 0 && (
                <div className="mb-4">
                  <WordHighlight words={currentEvaluation.word_analysis} />
                </div>
              )}

              {/* Score */}
              <div className={`text-2xl font-bold mb-2 ${
                currentEvaluation.score >= 8 ? 'text-green-500' : 'text-red-500'
              }`}>
                Điểm: {currentEvaluation.score}/10
              </div>

              {/* Feedback */}
              <p className="text-gray-600 text-sm mb-4">{currentEvaluation.feedback}</p>

              {/* Playback of User's voice */}
              {audioUrl && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="text-sm font-bold text-gray-600 mb-2">🎧 Nghe lại giọng bạn</div>
                  <audio src={audioUrl} controls className="h-10 w-full max-w-[300px]" />
                </div>
              )}

              {/* Pronunciation Tips (AI only) */}
              {currentEvaluation.pronunciation_tips && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-blue-700 text-sm">
                    <span className="font-bold">💡 Mẹo phát âm:</span> {currentEvaluation.pronunciation_tips}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={isRecording || isEvaluating}
            className="mx-auto flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {currentPosition === totalSentences - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
