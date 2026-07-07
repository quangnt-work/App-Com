// src/lib/examImportParser.ts
import mammoth from "mammoth";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedQuestion {
  number: number;
  question: string;
  options: string[];
  optionLabels: string[];
  correctIndex?: number;
}

export interface ImportStats {
  totalQuestions: number;
  totalAnswers: number;
  matchedCount: number;
  unmatchedQuestions: number[];
}

export interface ExamMetadata {
  title: string;
  level: string;
}

// ─── 1. Extract text from .docx ──────────────────────────────────────────────

export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  // Mammoth Node.js expects options.buffer as a Node Buffer
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value;
}

export function extractTextFromTxt(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

export async function extractText(buffer: ArrayBuffer, fileName: string): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "docx") {
    return extractTextFromDocx(buffer);
  }
  // .txt or other text files
  return extractTextFromTxt(buffer);
}

// ─── 2. Parse questions from text ────────────────────────────────────────────

// Map Cyrillic option labels to index
const CYRILLIC_LABEL_MAP: Record<string, number> = {
  "А": 0, "Б": 1, "В": 2, "Г": 3, "Д": 4, "Е": 5,
  // lowercase
  "а": 0, "б": 1, "в": 2, "г": 3, "д": 4, "е": 5,
};

const LATIN_LABEL_MAP: Record<string, number> = {
  "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5,
  "a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5,
};

/**
 * Regex pattern to match the start of a question line:
 * "1. Я __ домой вечером."
 * "23) Она работает ..."
 */
const QUESTION_START_RE = /^(\d+)\s*[.)]\s*(.+)/;

/**
 * Regex pattern to match an option line:
 * "А. иду"   "A) go"   "Б. идёшь"   "B. walks"
 */
const OPTION_LINE_RE = /^([А-ЕA-Ea-eа-е])\s*[.)]\s*(.+)/;

export function parseQuestionsFromText(text: string): ParsedQuestion[] {
  const lines = text.split(/\r?\n/);
  const questions: ParsedQuestion[] = [];
  let current: ParsedQuestion | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this is a new question
    const qMatch = line.match(QUESTION_START_RE);
    if (qMatch) {
      // Before starting a new question, check if there's a current question
      // that might not have options yet. Sometimes the question text continues
      // on the next line, but we need to check if this looks like a new question.
      // Only treat as new question if the number is sequential or the first question.
      const qNum = parseInt(qMatch[1], 10);
      
      // If current question has no options and this number doesn't seem sequential,
      // it might be a continuation line that happens to start with a number.
      // But in most exam formats, questions are numbered sequentially.
      if (current && current.options.length >= 2) {
        // Save previous question
        questions.push(current);
      } else if (current && current.options.length > 0) {
        // Question has some options but less than 2 - still save it
        questions.push(current);
      }
      // If current exists but has 0 options, the previous "question" was probably
      // part of the title or instructions - discard it.

      current = {
        number: qNum,
        question: qMatch[2].trim(),
        options: [],
        optionLabels: [],
      };
      continue;
    }

    // Check if this is an option line
    const optMatch = line.match(OPTION_LINE_RE);
    if (optMatch && current) {
      current.optionLabels.push(optMatch[1]);
      current.options.push(optMatch[2].trim());
      continue;
    }

    // Otherwise, if we have a current question, this might be a continuation of the question text
    if (current && current.options.length === 0) {
      current.question += " " + line;
    }
  }

  // Don't forget the last question
  if (current && current.options.length >= 2) {
    questions.push(current);
  }

  return questions;
}

// ─── 3. Parse answer key ─────────────────────────────────────────────────────

/**
 * Parse answer key text like:
 * "1-А, 2-Б, 3-В, 4-А"
 * "1.А 2.Б 3.В"
 * "1)А; 2)Б; 3)В"
 * "1:А 2:Б"
 * Or even one per line:
 * "1 - А"
 * "2 - Б"
 */
const ANSWER_ENTRY_RE = /(\d+)\s*[-.:)]\s*([А-ЕA-Ea-eа-е])/g;

export function parseAnswerKey(text: string): Map<number, string> {
  const answerMap = new Map<number, string>();

  let match: RegExpExecArray | null;
  while ((match = ANSWER_ENTRY_RE.exec(text)) !== null) {
    const qNum = parseInt(match[1], 10);
    const label = match[2].toUpperCase();
    // Normalize Cyrillic А to distinguish from Latin A
    answerMap.set(qNum, label);
  }

  return answerMap;
}

// ─── 4. Merge questions with answers ─────────────────────────────────────────

function labelToIndex(label: string, optionLabels: string[]): number {
  // First try to find the label in the question's own option labels
  const upperLabel = label.toUpperCase();
  for (let i = 0; i < optionLabels.length; i++) {
    if (optionLabels[i].toUpperCase() === upperLabel) {
      return i;
    }
  }

  // Fallback: use known mappings
  // Normalize: handle Cyrillic А (U+0410) vs Latin A (U+0041)
  const cyrIndex = CYRILLIC_LABEL_MAP[label] ?? CYRILLIC_LABEL_MAP[label.toUpperCase()];
  if (cyrIndex !== undefined) return cyrIndex;

  const latIndex = LATIN_LABEL_MAP[label] ?? LATIN_LABEL_MAP[label.toUpperCase()];
  if (latIndex !== undefined) return latIndex;

  return -1;
}

export function mergeQuestionsWithAnswers(
  questions: ParsedQuestion[],
  answerKey: Map<number, string>
): { questions: ParsedQuestion[]; stats: ImportStats } {
  let matchedCount = 0;
  const unmatchedQuestions: number[] = [];

  const merged = questions.map((q) => {
    const answerLabel = answerKey.get(q.number);
    if (answerLabel) {
      const idx = labelToIndex(answerLabel, q.optionLabels);
      if (idx >= 0 && idx < q.options.length) {
        matchedCount++;
        return { ...q, correctIndex: idx };
      }
    }
    unmatchedQuestions.push(q.number);
    return q;
  });

  return {
    questions: merged,
    stats: {
      totalQuestions: questions.length,
      totalAnswers: answerKey.size,
      matchedCount,
      unmatchedQuestions,
    },
  };
}

// ─── 5. Detect exam metadata ─────────────────────────────────────────────────

const LEVEL_RE = /\b(A1|A2|B1|B2|C1|C2)\b/i;

export function detectExamMetadata(text: string): ExamMetadata {
  // Get first non-empty line as title candidate
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let title = lines[0] || "Đề thi trắc nghiệm";

  // Clean up title: remove numbering if it starts like a question
  if (/^\d+\s*[.)]/.test(title)) {
    title = "Đề thi trắc nghiệm";
  }

  // Detect level
  const levelMatch = text.match(LEVEL_RE);
  const level = levelMatch ? levelMatch[1].toUpperCase() : "all";

  return { title, level };
}

// ─── 6. Convert parsed questions to exam schema format ───────────────────────

export function convertToExamQuestions(parsed: ParsedQuestion[]) {
  return parsed.map((q) => ({
    question_type: "multiple_choice" as const,
    question: q.question,
    selection_mode: "single" as const,
    options: q.options,
    correct_indexes: q.correctIndex !== undefined ? [q.correctIndex] : [],
    explanation: "",
  }));
}
