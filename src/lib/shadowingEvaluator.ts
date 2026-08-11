// src/lib/shadowingEvaluator.ts
// Offline evaluation using Word Error Rate (WER) / Levenshtein distance on words
// This replaces string-similarity for much higher accuracy.

import type { ShadowingEvaluation, WordAnalysis } from '@/types/shadowing';

/**
 * Normalize a Russian string for comparison:
 * - Lowercase
 * - Remove punctuation
 * - Trim whitespace
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,!?;:«»""''—–\-()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate Levenshtein matrix and backtrack to find word alignments
 */
function analyzeWordsWER(targetWords: string[], studentWords: string[]): WordAnalysis[] {
  const n = targetWords.length;
  const m = studentWords.length;
  
  // dp[i][j] stores the minimum edit distance
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
  
  // Backtracking matrix to reconstruct path
  // 0: match/substitute, 1: insert (extra), 2: delete (missing)
  const ptr: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
  
  for (let i = 1; i <= n; i++) dp[i][0] = i;
  for (let j = 1; j <= m; j++) dp[0][j] = j;
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = targetWords[i - 1] === studentWords[j - 1] ? 0 : 1;
      
      const sub = dp[i - 1][j - 1] + cost;
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      
      dp[i][j] = Math.min(sub, del, ins);
      
      if (dp[i][j] === sub) {
        ptr[i][j] = 0; // match or sub
      } else if (dp[i][j] === ins) {
        ptr[i][j] = 1; // student added extra word
      } else {
        ptr[i][j] = 2; // student missed target word
      }
    }
  }
  
  // Backtrack
  const results: WordAnalysis[] = [];
  let i = n;
  let j = m;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ptr[i][j] === 0) {
      if (targetWords[i - 1] === studentWords[j - 1]) {
        results.unshift({ word: studentWords[j - 1], status: 'correct' });
      } else {
        results.unshift({ word: studentWords[j - 1], status: 'wrong', expected: targetWords[i - 1] });
      }
      i--; j--;
    } else if (j > 0 && (i === 0 || ptr[i][j] === 1)) {
      results.unshift({ word: studentWords[j - 1], status: 'extra' });
      j--;
    } else if (i > 0 && (j === 0 || ptr[i][j] === 2)) {
      results.unshift({ word: targetWords[i - 1], status: 'missing' });
      i--;
    }
  }
  
  return results;
}

/**
 * Generate feedback message based on score.
 */
function generateFeedback(score: number): string {
  if (score >= 9) return 'Xuất sắc! Phát âm gần như hoàn hảo.';
  if (score >= 8) return 'Rất tốt! Chỉ cần chỉnh sửa nhỏ.';
  if (score >= 6) return 'Khá tốt, nhưng có vài từ chưa chính xác. Hãy nghe lại mẫu.';
  if (score >= 4) return 'Cần cải thiện. Hãy tập trung nghe kỹ từng từ rồi đọc lại.';
  return 'Chưa khớp với câu mẫu. Hãy nghe lại thật chậm và thử lại nhé!';
}

/**
 * Evaluate a student's speech OFFLINE using Word Error Rate (WER)
 */
export function evaluateOffline(targetText: string, studentText: string): ShadowingEvaluation {
  if (!studentText.trim()) {
    return {
      score: 0,
      transcript: '',
      word_analysis: [],
      feedback: 'Không nhận diện được giọng nói. Hãy nói to và rõ hơn.',
      evaluated_by: 'offline',
    };
  }

  const targetWords = normalize(targetText).split(' ').filter(Boolean);
  const studentWords = normalize(studentText).split(' ').filter(Boolean);
  
  if (targetWords.length === 0) {
     return {
        score: 10, transcript: studentText, word_analysis: [], feedback: '', evaluated_by: 'offline'
     };
  }

  const word_analysis = analyzeWordsWER(targetWords, studentWords);
  
  // Calculate WER score
  let errorCount = 0;
  word_analysis.forEach(w => {
    if (w.status !== 'correct') errorCount++;
  });
  
  // Convert error rate to 0-10 score
  const wer = errorCount / targetWords.length;
  // If errors >= length, score is 0. If errors == 0, score is 10.
  let rawScore = (1 - wer) * 10;
  rawScore = Math.max(0, Math.min(10, rawScore));
  
  const score = Math.round(rawScore);

  return {
    score,
    transcript: studentText,
    word_analysis,
    feedback: generateFeedback(score),
    evaluated_by: 'offline',
  };
}
