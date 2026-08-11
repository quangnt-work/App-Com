import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { evaluateOffline } from '@/lib/shadowingEvaluator';
import type { ShadowingEvaluation, ShadowingSessionState, ShadowingSentence } from '@/types/shadowing';

// Xóa các tham số Adaptive Streak cũ vì hệ thống giờ mặc định là Mù (Blind)
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

export function useShadowingSession(sentences: ShadowingSentence[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<ShadowingEvaluation | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Số lần thất bại ở câu hiện tại (để mở khóa hint)
  const [failuresOnCurrent, setFailuresOnCurrent] = useState(0);

  const [retryIndices, setRetryIndices] = useState<number[] | null>(null);
  const retryPositionRef = useRef(0);

  const [session, setSession] = useState<ShadowingSessionState>({
    scores: [],
    evaluations: [],
    combo: 0,
    maxCombo: 0,
    totalAttempts: 0,
  });

  const actualIndex = retryIndices ? (retryIndices[retryPositionRef.current] ?? 0) : currentIndex;
  const currentSentence = sentences ? sentences[actualIndex] : null;
  const totalSentences = retryIndices ? retryIndices.length : (sentences?.length ?? 0);
  const currentPosition = retryIndices ? retryPositionRef.current : currentIndex;
  
  // Dùng ref để giải quyết Race Condition (tránh set state khi đã qua câu khác)
  const evalIdRef = useRef(0);

  // Theo rule mới: Luôn luôn ở chế độ Mù (Blind Mode)
  const isBlindMode = true;
  // Hiện hint nếu sai từ 3 lần trở lên
  const showHint = failuresOnCurrent >= 3;

  const handleEvaluation = useCallback(async (studentText: string, targetText: string, onEvaluationDone?: () => void) => {
    if (!studentText.trim()) return;

    setIsEvaluating(true);
    const currentEvalId = ++evalIdRef.current;

    try {
      let evaluation: ShadowingEvaluation;

      // Do luôn luôn Blind Mode, chúng ta sẽ ưu tiên AI, nếu lỗi mạng thì dự phòng bằng Offline WER
      try {
        evaluation = await evaluateWithAI(targetText, studentText);
      } catch {
        evaluation = evaluateOffline(targetText, studentText);
        if (currentEvalId === evalIdRef.current) {
          toast.error('AI không khả dụng, đánh giá offline.', { position: 'top-center' });
        }
      }

      // Check race condition
      if (currentEvalId !== evalIdRef.current) return;

      setCurrentEvaluation(evaluation);
      if (onEvaluationDone) onEvaluationDone();

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
          // Tăng số lần sai ở câu hiện tại
          setFailuresOnCurrent(f => {
             const newFailures = f + 1;
             if (newFailures === 3) {
                toast.info('Bạn đã sai 3 lần. Hiển thị gợi ý câu mẫu!', { position: 'top-center' });
             } else {
                toast.error('Chưa chính xác lắm, hãy thử lại!', { position: 'top-center' });
             }
             return newFailures;
          });
        }

        return {
          scores: newScores,
          evaluations: newEvaluations,
          combo: newCombo,
          maxCombo: newMaxCombo,
          totalAttempts: prev.totalAttempts + 1,
        };
      });

    } catch (error) {
      console.error('Evaluation error:', error);
      if (currentEvalId === evalIdRef.current) {
         toast.error('Lỗi đánh giá. Vui lòng thử lại.', { position: 'top-center' });
      }
    } finally {
      if (currentEvalId === evalIdRef.current) {
         setIsEvaluating(false);
      }
    }
  }, [actualIndex]);

  const handleNext = useCallback(() => {
    evalIdRef.current++; // Invalidate pending eval
    setIsEvaluating(false);
    setFailuresOnCurrent(0); // Reset số lần sai cho câu mới
    
    if (retryIndices) {
      if (retryPositionRef.current < retryIndices.length - 1) {
        retryPositionRef.current += 1;
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      if (currentIndex < (sentences?.length ?? 0) - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }
  }, [retryIndices, currentIndex, sentences]);

  const handleRestart = useCallback(() => {
    evalIdRef.current++;
    setIsEvaluating(false);
    
    setCurrentIndex(0);
    setIsFinished(false);
    setRetryIndices(null);
    retryPositionRef.current = 0;
    setFailuresOnCurrent(0);
    setCurrentEvaluation(null);
    setSession({
      scores: [],
      evaluations: [],
      combo: 0,
      maxCombo: 0,
      totalAttempts: 0,
    });
  }, []);

  const handleRetryWeak = useCallback((weakIndices: number[]) => {
    evalIdRef.current++;
    setIsEvaluating(false);
    
    setRetryIndices(weakIndices);
    retryPositionRef.current = 0;
    setCurrentIndex(0);
    setIsFinished(false);
    setFailuresOnCurrent(0);
    setCurrentEvaluation(null);
    setSession(prev => ({ ...prev, combo: 0 }));
  }, []);

  return {
    currentIndex,
    currentSentence,
    isBlindMode,
    showHint,
    failuresOnCurrent,
    totalSentences,
    currentPosition,
    isFinished,
    session,
    isEvaluating,
    currentEvaluation,
    setCurrentEvaluation,
    
    handleEvaluation,
    handleNext,
    handleRestart,
    handleRetryWeak,
  };
}
