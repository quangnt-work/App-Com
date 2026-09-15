// src/types/shadowing.ts

// ─── Data Types (từ JSON) ─────────────────────────────────────────────────────

export interface ShadowingTopic {
  id: string;
  title: string;
  level: number;
  sentences: ShadowingSentence[];
}

export interface ShadowingSentence {
  id: number;
  ru: string;
  vi: string;
  audio_url?: string;
}

// ─── Word-level Analysis ──────────────────────────────────────────────────────

export interface WordAnalysis {
  word: string;
  status: 'correct' | 'wrong' | 'wrong_stress' | 'missing' | 'extra';
  expected?: string; // Từ đúng nếu status = 'wrong' hoặc từ có dấu trọng âm nếu status = 'wrong_stress'
  note?: string;     // Ghi chú cụ thể lỗi phát âm nếu có
}

// ─── Evaluation Result ────────────────────────────────────────────────────────

export interface ShadowingEvaluation {
  score: number;                  // 0-10
  transcript: string;             // Bóc băng từ AI hoặc STT
  word_analysis: WordAnalysis[];  // Phân tích từng từ
  feedback: string;               // Nhận xét
  pronunciation_tips?: string;    // Chỉ có khi dùng AI
  stress_guide?: string;          // Câu mẫu có đánh dấu trọng âm
  evaluated_by: 'offline' | 'ai'; // Nguồn đánh giá
}

// ─── In-Memory Session State ──────────────────────────────────────────────────

export interface ShadowingSessionState {
  scores: number[];                          // Score từng câu (index = sentence index)
  evaluations: (ShadowingEvaluation | null)[]; // Kết quả chi tiết từng câu
  combo: number;
  maxCombo: number;
  totalAttempts: number;
}

// ─── Speed Control ────────────────────────────────────────────────────────────

export type SpeechSpeed = 'slow' | 'normal' | 'fast';

export const SPEED_CONFIG: Record<SpeechSpeed, { rate: number; label: string; icon: string }> = {
  slow:   { rate: 0.6, label: 'Chậm',       icon: '🐢' },
  normal: { rate: 0.9, label: 'Bình thường', icon: '🚶' },
  fast:   { rate: 1.2, label: 'Nhanh',       icon: '🏃' },
};
