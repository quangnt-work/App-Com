// src/components/admin/exams/exam-editor/question-types/WordArrangement.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ExamInput } from "@/lib/schemas/exam";
import { Shuffle, Plus, X, AlignLeft, CheckCircle2 } from "lucide-react";

interface WordArrangementProps {
  index: number;
}

export default function WordArrangement({ index }: WordArrangementProps) {
  const form = useFormContext<ExamInput>();
  const [wordInput, setWordInput] = useState("");

  const words = (form.watch(`questions.${index}.words` as never) as string[]) ?? [];

  const addWord = () => {
    const trimmed = wordInput.trim();
    if (!trimmed) return;
    form.setValue(`questions.${index}.words` as never, [...words, trimmed] as never, {
      shouldValidate: true,
    });
    setWordInput("");
  };

  const removeWord = (wIdx: number) => {
    form.setValue(
      `questions.${index}.words` as never,
      words.filter((_, i) => i !== wIdx) as never,
      { shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
    }
  };

  return (
    <div className="space-y-4">
      {/* Ngữ cảnh / hướng dẫn */}
      <FormField
        control={form.control}
        name={`questions.${index}.context` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
              Ngữ cảnh / hướng dẫn (tuỳ chọn)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="VD: Sắp xếp các từ sau thành câu hoàn chỉnh."
                rows={2}
                {...(field as object)}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Bộ từ cho trước */}
      <div className="space-y-2">
        <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
          <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
          Bộ từ cho trước <span className="text-red-500">*</span>
        </FormLabel>

        {/* Tag display */}
        {words.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg min-h-[2.5rem]">
            {words.map((w, wIdx) => (
              <span
                key={wIdx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-300 text-indigo-700 text-sm font-medium rounded-full shadow-sm"
              >
                {w}
                <button
                  type="button"
                  onClick={() => removeWord(wIdx)}
                  className="text-indigo-300 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add word input */}
        <div className="flex items-center gap-2">
          <Input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Nhập từ rồi nhấn Enter hoặc bấm "Thêm"...'
            className="h-9 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1 shrink-0"
            onClick={addWord}
            disabled={!wordInput.trim()}
          >
            <Plus className="w-3.5 h-3.5" /> Thêm
          </Button>
        </div>

        <FormField
          control={form.control}
          name={`questions.${index}.words` as never}
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Câu đúng */}
      <FormField
        control={form.control}
        name={`questions.${index}.correct_sentence` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Câu đúng (đáp án) <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nhập câu hoàn chỉnh đúng..."
                className="h-10"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Giải thích */}
      <FormField
        control={form.control}
        name={`questions.${index}.explanation` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">Giải thích (tuỳ chọn)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Giải thích cấu trúc câu..."
                rows={2}
                {...(field as object)}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
