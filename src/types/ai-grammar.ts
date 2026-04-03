// src/types/ai-grammar.ts

import { ReactNode } from 'react';

// ─── Topic ────────────────────────────────────────────────────────────────────

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  themeColor: {
    bg: string;
    iconBg: string;
    iconColor: string;
    border: string;
  };
  href: string;
}

// ─── Quiz Question (AI-generated) ─────────────────────────────────────────────

export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface GrammarQuestion {
  id: number;
  question: string;
  options: [string, string, string, string]; // luôn 4 đáp án
  correctIndex: number; // 0-3
  explanation: string;
  level: GrammarLevel;
}

// ─── Quiz State ───────────────────────────────────────────────────────────────

export interface GrammarAnswer {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface GrammarQuizResult {
  score: number;
  total: number;
  percentage: number;
  levelBreakdown: Record<GrammarLevel, { correct: number; total: number }>;
  feedback: string;
}
