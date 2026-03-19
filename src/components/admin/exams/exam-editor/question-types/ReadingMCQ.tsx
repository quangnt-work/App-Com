// src/components/admin/exams/exam-editor/question-types/ReadingMCQ.tsx
"use client";

import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ExamInput } from "@/lib/schemas/exam";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  CheckSquare2,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingMCQProps {
  index: number;
}

export default function ReadingMCQ({ index }: ReadingMCQProps) {
  const form = useFormContext<ExamInput>();
  const baseName = `questions.${index}` as const;

  const { fields: optionFields, append: appendOption, remove: removeOption } =
    useFieldArray({
      control: form.control,
      // @ts-expect-error TS complex union path
      name: `${baseName}.options`,
    });

  const selectionMode = ((form.watch(`questions.${index}` as never) as unknown) as {
    selection_mode: "single" | "multi";
    correct_indexes: number[];
  });
  const isMulti = selectionMode?.selection_mode === "multi";
  const correctIndexes: number[] = selectionMode?.correct_indexes ?? [];

  const toggleCorrect = useCallback(
    (optIdx: number) => {
      if (isMulti) {
        const current = ((form.getValues(
          `questions.${index}.correct_indexes` as never
        ) as unknown) as number[]) || [];
        const next = current.includes(optIdx)
          ? current.filter((i) => i !== optIdx)
          : [...current, optIdx];
        form.setValue(
          `questions.${index}.correct_indexes` as never,
          next as never,
          { shouldValidate: true }
        );
      } else {
        form.setValue(
          `questions.${index}.correct_indexes` as never,
          [optIdx] as never,
          { shouldValidate: true }
        );
      }
    },
    [form, index, isMulti]
  );

  return (
    <div className="space-y-4">
      {/* Đoạn văn */}
      <FormField
        control={form.control}
        name={`questions.${index}.passage` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Đoạn văn bản <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Nhập đoạn văn cần đọc..."
                rows={5}
                className="resize-y font-mono text-sm"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Câu hỏi */}
      <FormField
        control={form.control}
        name={`questions.${index}.question` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">
              Câu hỏi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nhập câu hỏi..."
                className="h-10"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Chế độ chọn đáp án */}
      <FormField
        control={form.control}
        name={`questions.${index}.selection_mode` as never}
        render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Switch
                checked={(field as { value: string }).value === "multi"}
                onCheckedChange={(checked) => {
                  (field as { onChange: (v: string) => void }).onChange(
                    checked ? "multi" : "single"
                  );
                  // Reset correct_indexes when switching
                  form.setValue(
                    `questions.${index}.correct_indexes` as never,
                    [] as never
                  );
                }}
              />
            </FormControl>
            <Label className="text-sm text-gray-600 cursor-pointer font-medium">
              {(field as { value: string }).value === "multi"
                ? "Chọn nhiều đáp án"
                : "Chọn 1 đáp án"}
            </Label>
          </FormItem>
        )}
      />

      {/* Các đáp án */}
      <div className="space-y-2">
        <FormLabel className="font-medium text-gray-700">
          Đáp án <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 font-normal ml-2">
            (bấm vào đáp án để đánh dấu đúng)
          </span>
        </FormLabel>
        
        {/* @ts-ignore deep union mapping issue */}
        {form.formState.errors.questions?.[index]?.correct_indexes && (
          <p className="text-[0.8rem] font-medium text-red-500">
            {/* @ts-ignore */}
            {form.formState.errors.questions[index]?.correct_indexes?.message as string}
          </p>
        )}

        {optionFields.map((opt, optIdx) => {
          const isCorrect = correctIndexes.includes(optIdx);
          return (
            <div key={opt.id} className="flex items-center gap-2">
              {/* Correct toggle */}
              <button
                type="button"
                onClick={() => toggleCorrect(optIdx)}
                className={cn(
                  "shrink-0 transition-colors",
                  isCorrect ? "text-green-500" : "text-gray-300 hover:text-gray-400"
                )}
              >
                {isMulti ? (
                  isCorrect ? (
                    <CheckSquare2 className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )
                ) : isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              {/* Option label */}
              <span className="text-sm font-medium text-gray-500 w-5 shrink-0">
                {String.fromCharCode(65 + optIdx)}.
              </span>

              <FormField
                control={form.control}
                name={`questions.${index}.options.${optIdx}` as never}
                render={({ field }) => (
                  <FormItem className="flex-1 m-0">
                    <FormControl>
                      <Input
                        placeholder={`Đáp án ${String.fromCharCode(65 + optIdx)}`}
                        className={cn(
                          "h-9 transition-colors",
                          isCorrect &&
                            "border-green-400 bg-green-50 focus-visible:ring-green-300"
                        )}
                        {...(field as object)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="button"
                onClick={() => removeOption(optIdx)}
                className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                disabled={optionFields.length <= 2}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {optionFields.length < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-8 text-xs gap-1 text-gray-500"
            onClick={() => appendOption("" as never)}
          >
            <Plus className="w-3.5 h-3.5" /> Thêm đáp án
          </Button>
        )}
      </div>

      {/* Giải thích */}
      <FormField
        control={form.control}
        name={`questions.${index}.explanation` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">
              Giải thích (tuỳ chọn)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Giải thích tại sao đáp án đó đúng..."
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
