'use client';

import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Volume2, Square, ArrowRight, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import shadowingData from '@/data/shadowing.json';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { evaluateOffline } from '@/lib/shadowingEvaluator';
import { SpeedControl } from '@/components/student/ai/shadowing/SpeedControl';
import { WordHighlight } from '@/components/student/ai/shadowing/WordHighlight';
import { ShadowingResult } from '@/components/student/ai/shadowing/ShadowingResult';

import type { SpeechSpeed, ShadowingEvaluation, ShadowingSessionState } from '@/types/shadowing';
import { SPEED_CONFIG } from '@/types/shadowing';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_BLIND_START = 5; // Blind mode bắt đầu từ câu 6 (index 5)
const ADAPTIVE_STREAK_THRESHOLD = 3; // 3 câu liên tiếp score >= 9 → blind sớm hơn
const ADAPTIVE_SHIFT = 2; // Blind sớm hơn 2 câu
const WEAK_STREAK_THRESHOLD = 3; // 3 câu liên tiếp score < 5 → tạm tắt blind

// ─── AI Evaluation (fetch) ────────────────────────────────────────────────────

async function evaluateWithAI(targetText: string, studentText: string): Promise<ShadowingEvaluation> {
  const res = await fetch('/api/shadowing-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetText, studentText }),
  });

  if (!res.ok) {
    throw new Error('AI evaluation failed');
  }

  return res.json();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShadowingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  const topic = shadowingData.find(t => t.id === topicId);

  // ─── State ──────────────────────────────────────────────────────────────────

  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState<SpeechSpeed>('normal');
  const [showText, setShowText] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<ShadowingEvaluation | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Retry weak mode
  const [retryIndices, setRetryIndices] = useState<number[] | null>(null);
  const retryPositionRef = useRef(0);

  // In-memory session
  const [session, setSession] = useState<ShadowingSessionState>({
    scores: [],
    evaluations: [],
    combo: 0,
    maxCombo: 0,
    totalAttempts: 0,
  });

  // Adaptive blind mode tracking
  const recentScoresRef = useRef<number[]>([]);
  const [blindStartIndex, setBlindStartIndex] = useState(DEFAULT_BLIND_START);

  // Speech recognition
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition('ru-RU');

  // ─── Derived State ──────────────────────────────────────────────────────────

  const actualIndex = retryIndices ? retryIndices[retryPositionRef.current] ?? 0 : currentIndex;
  const currentSentence = topic?.sentences[actualIndex];
  const isBlindMode = actualIndex >= blindStartIndex;
  const totalSentences = retryIndices ? retryIndices.length : (topic?.sentences.length ?? 0);
  const currentPosition = retryIndices ? retryPositionRef.current : currentIndex;

  // ─── Effects ────────────────────────────────────────────────────────────────

  // Redirect if topic not found
  useEffect(() => {
    if (!topic) {
      router.push('/student/ai/immersive/shadowing');
    }
  }, [topic, router]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Reset state when moving to a new sentence
  useEffect(() => {
    setCurrentEvaluation(null);
    setShowText(!isBlindMode);
    resetTranscript();

    // Auto-play audio for new sentence
    const timer = setTimeout(() => {
      if (currentSentence) {
        playAudio(currentSentence.ru);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, retryIndices]);

  // Evaluate when recording stops and we have a transcript
  useEffect(() => {
    if (!isRecording && transcript && currentSentence && !currentEvaluation) {
      handleEvaluation(transcript, currentSentence.ru);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, transcript]);

  // ─── Audio ──────────────────────────────────────────────────────────────────

  const playAudio = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = SPEED_CONFIG[speed].rate;
    window.speechSynthesis.speak(utterance);
  }, [speed]);

  // ─── Evaluation Logic ──────────────────────────────────────────────────────

  const handleEvaluation = useCallback(async (studentText: string, targetText: string) => {
    if (!studentText.trim()) return;

    setIsEvaluating(true);

    try {
      let evaluation: ShadowingEvaluation;

      if (isBlindMode) {
        // AI evaluation for blind mode (câu 6+)
        try {
          evaluation = await evaluateWithAI(targetText, studentText);
        } catch {
          // Fallback to offline if AI fails
          evaluation = evaluateOffline(targetText, studentText);
          toast.error('AI không khả dụng, đánh giá offline.', { position: 'top-center' });
        }
      } else {
        // Offline evaluation for visible text (câu 1-5)
        evaluation = evaluateOffline(targetText, studentText);
      }

      setCurrentEvaluation(evaluation);
      setShowText(true); // Show text for comparison

      // Update session state
      setSession(prev => {
        const newScores = [...prev.scores];
        newScores[actualIndex] = evaluation.score;
        const newEvaluations = [...prev.evaluations];
        newEvaluations[actualIndex] = evaluation;

        let newCombo = prev.combo;
        let newMaxCombo = prev.maxCombo;

        if (evaluation.score >= 8) {
          newCombo += 1;
          newMaxCombo = Math.max(newMaxCombo, newCombo);
          toast.success(`Tuyệt vời! +1 Combo (${newCombo})`, { position: 'top-center' });
        } else {
          newCombo = 0;
          toast.error('Chưa chính xác lắm, hãy thử lại!', { position: 'top-center' });
        }

        return {
          scores: newScores,
          evaluations: newEvaluations,
          combo: newCombo,
          maxCombo: newMaxCombo,
          totalAttempts: prev.totalAttempts + 1,
        };
      });

      // Adaptive blind mode
      recentScoresRef.current.push(evaluation.score);
      if (recentScoresRef.current.length > ADAPTIVE_STREAK_THRESHOLD) {
        recentScoresRef.current.shift();
      }

      const recent = recentScoresRef.current;
      if (recent.length >= ADAPTIVE_STREAK_THRESHOLD) {
        if (recent.every(s => s >= 9)) {
          // All recent scores >= 9 → make blind mode start earlier
          setBlindStartIndex(prev => Math.max(prev - ADAPTIVE_SHIFT, 2));
        } else if (recent.every(s => s < 5)) {
          // All recent scores < 5 → relax blind mode
          setBlindStartIndex(prev => Math.min(prev + ADAPTIVE_SHIFT, DEFAULT_BLIND_START + 4));
        }
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Lỗi đánh giá. Vui lòng thử lại.', { position: 'top-center' });
    } finally {
      setIsEvaluating(false);
    }
  }, [isBlindMode, actualIndex]);

  // ─── Controls ───────────────────────────────────────────────────────────────

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
  }, [isSupported, isRecording, stopRecording, resetTranscript, startRecording]);

  const handleNext = useCallback(() => {
    if (retryIndices) {
      // Retry weak mode
      if (retryPositionRef.current < retryIndices.length - 1) {
        retryPositionRef.current += 1;
        setCurrentIndex(prev => prev + 1); // Trigger re-render
      } else {
        setIsFinished(true);
      }
    } else {
      if (currentIndex < (topic?.sentences.length ?? 0) - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }
  }, [retryIndices, currentIndex, topic]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFinished(false);
    setRetryIndices(null);
    retryPositionRef.current = 0;
    setBlindStartIndex(DEFAULT_BLIND_START);
    recentScoresRef.current = [];
    setSession({
      scores: [],
      evaluations: [],
      combo: 0,
      maxCombo: 0,
      totalAttempts: 0,
    });
  }, []);

  const handleRetryWeak = useCallback((weakIndices: number[]) => {
    setRetryIndices(weakIndices);
    retryPositionRef.current = 0;
    setCurrentIndex(0); // Reset to trigger re-render
    setIsFinished(false);
    setSession(prev => ({ ...prev, combo: 0 }));
  }, []);

  // ─── Render Guards ──────────────────────────────────────────────────────────

  if (!topic || !currentSentence) return null;

  // ─── Finished State ─────────────────────────────────────────────────────────

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

  // ─── Practice UI ────────────────────────────────────────────────────────────

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
              {retryIndices ? '🔄 ' : ''}Câu {currentPosition + 1} / {totalSentences}
            </div>
          </div>
          <SpeedControl currentSpeed={speed} onSpeedChange={setSpeed} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center relative overflow-hidden">

          {/* Blind Mode Badge */}
          {isBlindMode && !showText && (
            <div className="absolute top-4 right-4 text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">
              <EyeOff size={14} /> BLIND MODE
            </div>
          )}

          {/* Adaptive Badge */}
          {blindStartIndex !== DEFAULT_BLIND_START && (
            <div className="absolute top-4 left-4 text-xs font-bold bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
              ⚡ Adaptive
            </div>
          )}

          {/* Sentence Display */}
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

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => playAudio(currentSentence.ru)}
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
                  {currentEvaluation.evaluated_by === 'ai' ? '🤖 AI' : '📊 Offline'}
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
              <p className="text-gray-600 text-sm">{currentEvaluation.feedback}</p>

              {/* Pronunciation Tips (AI only) */}
              {currentEvaluation.pronunciation_tips && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
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
