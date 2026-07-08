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
 * "Câu 1: ..."
 */
const QUESTION_START_RE = /^\s*(?:Câu|Question|Bài)?\s*(\d+)\s*[.:)]\s*(.+)/i;

/**
 * Regex pattern to match an option line:
 * "А. иду"   "A) go"   "Б. идёшь"   "B. walks"
 */
const OPTION_LINE_RE = /^\s*([А-ЕA-Ea-eа-е])\s*[.:)]\s*(.+)/;

/**
 * Pre-process raw text to handle cases where mammoth merges
 * question text and options into a single line, e.g.:
 * "Вчера я ______ в библиотеку.А. ходилБ. пойдуВ. хожуГ. пойду"
 * 
 * We insert newlines before each option label (А., Б., В., etc.)
 * so the line-based parser can handle them.
 */
function preprocessText(text: string): string {
  // Insert newline before option labels that are stuck to previous text
  // Match: non-whitespace char followed by a Cyrillic/Latin option label + dot/paren
  // e.g. "работы.А. ходил" → "работы.\nА. ходил"
  //       "идёмБ. идёшь" → "идём\nБ. идёшь"
  let processed = text.replace(
    /([^\n])([А-ЕA-Eа-е]\s*[.):]\s*)/g,
    (match, before, optionPart) => {
      // Don't split if the char before is a space/newline (already separated)
      if (/\s/.test(before)) return match;
      return before + "\n" + optionPart;
    }
  );
  
  // Also handle numbered questions stuck together
  // e.g. "пойду2. Если завтра" → "пойду\n2. Если завтра"
  processed = processed.replace(
    /([^\n\d])(\d+\s*[.):]\s*)/g,
    (match, before, numPart) => {
      if (/\s/.test(before)) return match;
      return before + "\n" + numPart;
    }
  );

  return processed;
}

export function parseQuestionsFromText(text: string): ParsedQuestion[] {
  // Pre-process: split merged lines
  const processedText = preprocessText(text);
  const lines = processedText.split(/\r?\n/);
  const questions: ParsedQuestion[] = [];
  let current: ParsedQuestion | null = null;
  let autoQuestionNumber = 1;
  let pendingText: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this is a new explicitly numbered question
    const qMatch = line.match(QUESTION_START_RE);
    if (qMatch) {
      if (current && current.options.length > 0) {
        questions.push(current);
      }
      
      const parsedNum = parseInt(qMatch[1], 10);
      autoQuestionNumber = parsedNum + 1;

      current = {
        number: parsedNum,
        question: qMatch[2].trim(),
        options: [],
        optionLabels: [],
      };
      pendingText = [];
      continue;
    }

    // Check if this is an option line
    const optMatch = line.match(OPTION_LINE_RE);
    if (optMatch) {
      const label = optMatch[1];
      const isFirstOption = label.toUpperCase() === 'A' || label === 'А' || label === 'а';

      // If we see the first option (A/А) and current already has options,
      // it means a new question block has started
      if (current && current.options.length > 0 && isFirstOption) {
        questions.push(current);
        current = null;
      }

      if (!current) {
        // If this is the very first question, pendingText might have accumulated document titles.
        // We filter out common title lines (all caps, or contains specific keywords)
        if (questions.length === 0 && pendingText.length > 1) {
          while (pendingText.length > 1) {
            const firstUpper = pendingText[0].toUpperCase();
            const isTitle = 
              firstUpper.includes("NGÂN HÀNG") || 
              firstUpper.includes("ĐỀ THI") || 
              firstUpper.includes("BÀI TẬP") || 
              firstUpper.includes("TEST ") || 
              firstUpper.includes("PHẦN ") ||
              firstUpper.includes("TRÌNH ĐỘ") ||
              firstUpper === pendingText[0]; // all caps

            if (isTitle) {
              pendingText.shift(); // Remove the title line
            } else {
              break;
            }
          }
        }

        // Create new question from pending text
        const qText = pendingText.length > 0 ? pendingText.join(" ") : "Câu hỏi bị thiếu nội dung";
        current = {
          number: autoQuestionNumber++,
          question: qText,
          options: [],
          optionLabels: [],
        };
        pendingText = [];
      }
      
      current.optionLabels.push(label);
      current.options.push(optMatch[2].trim());
      continue;
    }

    // Otherwise, it's just text.
    if (current && current.options.length === 0) {
      current.question += " " + line;
    } else if (current && current.options.length > 0) {
      pendingText.push(line);
    } else {
      pendingText.push(line);
    }
  }

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
