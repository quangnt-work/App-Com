// src/components/admin/exams/exam-editor/sections/QuestionBuilder.tsx
"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExamInput,
  ExamQuestionType,
  QUESTION_TYPE_LABELS,
} from "@/lib/schemas/exam";
import {
  BookOpen,
  Volume2,
  Shuffle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  GripVertical,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReadingMCQ from "../question-types/ReadingMCQ";
import ReadingOpenEnded from "../question-types/ReadingOpenEnded";
import ListeningMCQ from "../question-types/ListeningMCQ";
import ListeningOpenEnded from "../question-types/ListeningOpenEnded";
import ListeningFillBlank from "../question-types/ListeningFillBlank";
import WordArrangement from "../question-types/WordArrangement";
import ErrorCorrection from "../question-types/ErrorCorrection";

// ─── Default values per question type ────────────────────────────────────────

function createDefaultQuestion(type: ExamQuestionType) {
  switch (type) {
    case "reading_mcq":
      return {
        question_type: "reading_mcq" as const,
        passage: "",
        question: "",
        selection_mode: "single" as const,
        options: ["", ""],
        correct_indexes: [],
      };
    case "reading_open":
      return {
        question_type: "reading_open" as const,
        passage: "",
        question: "",
        sample_answer: "",
      };
    case "listening_mcq":
      return {
        question_type: "listening_mcq" as const,
        audio_url: "",
        question: "",
        selection_mode: "single" as const,
        options: ["", ""],
        correct_indexes: [],
      };
    case "listening_open":
      return {
        question_type: "listening_open" as const,
        audio_url: "",
        question: "",
        sample_answer: "",
      };
    case "listening_fill":
      return {
        question_type: "listening_fill" as const,
        audio_url: "",
        transcript_template: "",
        correct_answers: [],
      };
    case "word_arrangement":
      return {
        question_type: "word_arrangement" as const,
        context: "",
        words: [],
        correct_sentence: "",
      };
    case "error_correction":
      return {
        question_type: "error_correction" as const,
        sentence: "",
        wrong_part: "",
        correct_part: "",
        explanation: "",
      };
  }
}

// ─── Icon per type ────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<ExamQuestionType, React.ReactNode> = {
  reading_mcq: <BookOpen className="w-3.5 h-3.5" />,
  reading_open: <BookOpen className="w-3.5 h-3.5" />,
  listening_mcq: <Volume2 className="w-3.5 h-3.5" />,
  listening_open: <Volume2 className="w-3.5 h-3.5" />,
  listening_fill: <Volume2 className="w-3.5 h-3.5" />,
  word_arrangement: <Shuffle className="w-3.5 h-3.5" />,
  error_correction: <AlertTriangle className="w-3.5 h-3.5" />,
};

const TYPE_COLORS: Record<ExamQuestionType, string> = {
  reading_mcq: "bg-blue-100 text-blue-600",
  reading_open: "bg-blue-100 text-blue-600",
  listening_mcq: "bg-purple-100 text-purple-600",
  listening_open: "bg-purple-100 text-purple-600",
  listening_fill: "bg-purple-100 text-purple-600",
  word_arrangement: "bg-indigo-100 text-indigo-600",
  error_correction: "bg-amber-100 text-amber-600",
};

// ─── Render question form by type ─────────────────────────────────────────────

function QuestionForm({ type, index }: { type: ExamQuestionType; index: number }) {
  switch (type) {
    case "reading_mcq":
      return <ReadingMCQ index={index} />;
    case "reading_open":
      return <ReadingOpenEnded index={index} />;
    case "listening_mcq":
      return <ListeningMCQ index={index} />;
    case "listening_open":
      return <ListeningOpenEnded index={index} />;
    case "listening_fill":
      return <ListeningFillBlank index={index} />;
    case "word_arrangement":
      return <WordArrangement index={index} />;
    case "error_correction":
      return <ErrorCorrection index={index} />;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuestionBuilder() {
  const form = useFormContext<ExamInput>();
  const [selectedType, setSelectedType] = useState<ExamQuestionType>("reading_mcq");
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleAdd = () => {
    const newQ = createDefaultQuestion(selectedType);
    // @ts-ignore union type append
    append(newQ);
    // Auto-expand the new question
    setExpandedIndexes((prev) => new Set([...prev, fields.length]));
  };

  const toggleExpand = (i: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-orange-500" />
          Danh sách câu hỏi
          {fields.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600 font-semibold">
              {fields.length}
            </span>
          )}
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Add question row */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
          <Select
            value={selectedType}
            onValueChange={(v) => setSelectedType(v as ExamQuestionType)}
          >
            <SelectTrigger className="flex-1 h-10 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(QUESTION_TYPE_LABELS) as [ExamQuestionType, string][]).map(
                ([val, label]) => (
                  <SelectItem key={val} value={val}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "p-1 rounded",
                          TYPE_COLORS[val]
                        )}
                      >
                        {TYPE_ICONS[val]}
                      </span>
                      {label}
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Button
            type="button"
            className="h-10 gap-2 bg-orange-500 hover:bg-orange-600 text-white shrink-0"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
            Thêm câu hỏi
          </Button>
        </div>

        {/* Question list */}
        {fields.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ListChecks className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Chưa có câu hỏi nào. Chọn dạng câu hỏi và bấm "Thêm câu hỏi".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, i) => {
              const qType = (field as { question_type: ExamQuestionType }).question_type;
              const isExpanded = expandedIndexes.has(i);

              return (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Card header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 cursor-pointer hover:bg-gray-100/70 transition-colors"
                    onClick={() => toggleExpand(i)}
                  >
                    {/* Drag handle (visual only) */}
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

                    {/* Question number */}
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>

                    {/* Type badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                        TYPE_COLORS[qType]
                      )}
                    >
                      {TYPE_ICONS[qType]}
                      {QUESTION_TYPE_LABELS[qType]}
                    </span>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(i);
                        setExpandedIndexes((prev) => {
                          const next = new Set<number>();
                          prev.forEach((idx) => {
                            if (idx < i) next.add(idx);
                            else if (idx > i) next.add(idx - 1);
                          });
                          return next;
                        });
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand toggle */}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </div>

                  {/* Card body */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 bg-white">
                      <QuestionForm type={qType} index={i} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
