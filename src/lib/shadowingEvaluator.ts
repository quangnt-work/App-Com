// src/lib/shadowingEvaluator.ts
// Offline evaluation for sentences 1-5 (visible text mode)
// Uses string-similarity for overall score + word-level diff for highlighting

import stringSimilarity from 'string-similarity';
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
    .replace(/[.,!?;:«»"""''—–\-()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compare two word arrays and produce word-level analysis.
 * Uses a simple LCS-like approach to align words.
 */
function analyzeWords(targetWords: string[], studentWords: string[]): WordAnalysis[] {
  const results: WordAnalysis[] = [];
  
  let ti = 0; // target index
  let si = 0; // student index

  while (ti < targetWords.length || si < studentWords.length) {
    if (ti >= targetWords.length) {
      // Student said extra words
      results.push({ word: studentWords[si], status: 'extra' });
      si++;
      continue;
    }
    
    if (si >= studentWords.length) {
      // Student missed words
      results.push({ word: targetWords[ti], status: 'missing' });
      ti++;
      continue;
    }

    const targetWord = targetWords[ti];
    const studentWord = studentWords[si];

    if (normalize(targetWord) === normalize(studentWord)) {
      // Exact match
      results.push({ word: studentWord, status: 'correct' });
      ti++;
      si++;
    } else {
      // Check if it's a substitution or a skip
      // Look ahead in target to see if student word appears later
      const futureTargetIdx = targetWords.slice(ti + 1, ti + 4).findIndex(
        w => normalize(w) === normalize(studentWord)
      );
      
      // Look ahead in student to see if target word appears later
      const futureStudentIdx = studentWords.slice(si + 1, si + 4).findIndex(
        w => normalize(w) === normalize(targetWord)
      );

      if (futureTargetIdx !== -1 && (futureStudentIdx === -1 || futureTargetIdx <= futureStudentIdx)) {
        // Target word was skipped — mark as missing
        for (let i = 0; i <= futureTargetIdx; i++) {
          results.push({ word: targetWords[ti + i], status: 'missing' });
        }
        ti += futureTargetIdx + 1;
        // Don't advance si — we'll match it in the next iteration
      } else if (futureStudentIdx !== -1) {
        // Student said extra words before the target
        for (let i = 0; i < futureStudentIdx; i++) {
          results.push({ word: studentWords[si + i], status: 'extra' });
        }
        si += futureStudentIdx;
        // Don't advance ti — we'll match it in the next iteration
      } else {
        // Simple substitution — wrong word
        const wordSim = stringSimilarity.compareTwoStrings(
          normalize(targetWord),
          normalize(studentWord)
        );

        if (wordSim >= 0.6) {
          // Close enough — likely a pronunciation variant
          results.push({ word: studentWord, status: 'correct' });
        } else {
          results.push({ word: studentWord, status: 'wrong', expected: targetWord });
        }
        ti++;
        si++;
      }
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
 * Evaluate a student's speech OFFLINE (no API call).
 * Used for sentences 1-5 where text is visible.
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

  // Overall similarity score
  const similarity = stringSimilarity.compareTwoStrings(
    normalize(targetText),
    normalize(studentText)
  );
  const score = Math.round(similarity * 10);

  // Word-level analysis
  const targetWords = normalize(targetText).split(' ').filter(Boolean);
  const studentWords = normalize(studentText).split(' ').filter(Boolean);
  const word_analysis = analyzeWords(targetWords, studentWords);

  return {
    score,
    transcript: studentText,
    word_analysis,
    feedback: generateFeedback(score),
    evaluated_by: 'offline',
  };
}
