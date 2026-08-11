//src/types/ai-chat.ts

import { ReactNode } from 'react';

export interface ChatTopic {
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

export interface ChatAssessment {
  vocabulary: string;
  intonation: string;
  overall_level: string; // Ví dụ: A1, A2, B1...
  general_feedback: string;
}

export interface ChatMessageType {
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'audio';
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatRequestBody {
  messages: ChatMessageType[];
  topic: string;
  isAssessment: boolean;
}

// ─── Roleplay Types ───────────────────────────────────────────────────────────

export interface RoleplayObjective {
  id: string;
  description: string;
  hint_vi: string;
  hint_ru: string;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  level: number | string;
  context: string;
  ai_role: string;
  first_message: string;
  objectives: RoleplayObjective[];
  topic_keyword?: string;
  created_at?: string;
}