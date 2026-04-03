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
import RichTextEditor from "@/components/ui/rich-text-editor";
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

interface ReadingGroupProps {
  index: number;
}

export default function ReadingGroup({ index }: ReadingGroupProps) {
  const form = useFormContext<ExamInput>();
  const baseName = `questions.${index}` as const;

  const { fields: subQuestions, append: appendSubQ, remove: removeSubQ } = useFieldArray({
    control: form.control,
    name: `${baseName}.sub_questions` as never,
  });

  const handleAddSubQuestion = () => {
    appendSubQ({
      question: "",
      selection_mode: "single",
      options: ["", ""],
      correct_indexes: [],
      explanation: "",
    } as never);
  };

  return (
    <div className="space-y-6">
      {/* Đoạn văn chung */}
      <FormField
        control={form.control}
        name={`${baseName}.passage` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Đoạn văn đọc hiểu chung <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RichTextEditor
                placeholder="Nhập đoạn văn dùng chung cho các câu hỏi bên dưới..."
                value={(field as any).value || ""}
                onChange={(field as any).onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pt-2 border-t border-gray-100">
        <FormLabel className="font-semibold text-gray-800 text-base">
          Các câu hỏi con
        </FormLabel>
        
        {/* @ts-ignore */}
        {form.formState.errors.questions?.[index]?.sub_questions?.root?.message && (
          <p className="text-sm font-medium text-red-500">
            {/* @ts-ignore */}
            {form.formState.errors.questions[index].sub_questions.root.message}
          </p>
        )}

        {subQuestions.map((subQ, subIdx) => (
          <SubQuestionItem
            key={subQ.id}
            groupIndex={index}
            subIndex={subIdx}
            removeSubQ={() => removeSubQ(subIdx)}
            canRemove={subQuestions.length > 1}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 bg-blue-50/50 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          onClick={handleAddSubQuestion}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm câu hỏi con
        </Button>
      </div>
    </div>
  );
}

function SubQuestionItem({
  groupIndex,
  subIndex,
  removeSubQ,
  canRemove,
}: {
  groupIndex: number;
  subIndex: number;
  removeSubQ: () => void;
  canRemove: boolean;
}) {
  const form = useFormContext<ExamInput>();
  const basePath = `questions.${groupIndex}.sub_questions.${subIndex}` as const;

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: `${basePath}.options` as never,
  });

  const selectionModeObj = form.watch(basePath as never) as any;
  const isMulti = selectionModeObj?.selection_mode === "multi";
  const correctIndexes: number[] = selectionModeObj?.correct_indexes ?? [];

  const toggleCorrect = useCallback(
    (optIdx: number) => {
      if (isMulti) {
        const current = ((form.getValues(`${basePath}.correct_indexes` as never) as unknown) as number[]) || [];
        const next = current.includes(optIdx)
          ? current.filter((i) => i !== optIdx)
          : [...current, optIdx];
        form.setValue(`${basePath}.correct_indexes` as never, next as never, { shouldValidate: true });
      } else {
        form.setValue(`${basePath}.correct_indexes` as never, [optIdx] as never, { shouldValidate: true });
      }
    },
    [form, basePath, isMulti]
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
      {canRemove && (
        <button
          type="button"
          onClick={removeSubQ}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Xóa câu hỏi con này"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      <div className="mb-4 pr-6">
         <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
            {subIndex + 1}
         </span>
      </div>

      <div className="space-y-4">
        {/* Câu hỏi */}
        <FormField
          control={form.control}
          name={`${basePath}.question` as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-700">Câu hỏi <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nhập câu hỏi..." className="h-10 bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Chế độ chọn */}
        <FormField
          control={form.control}
          name={`${basePath}.selection_mode` as never}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch
                  checked={(field as any).value === "multi"}
                  onCheckedChange={(checked) => {
                    (field as any).onChange(checked ? "multi" : "single");
                    form.setValue(`${basePath}.correct_indexes` as never, [] as never);
                  }}
                />
              </FormControl>
              <Label className="text-sm text-gray-600 cursor-pointer font-medium">
                {(field as any).value === "multi" ? "Chọn nhiều đáp án" : "Chọn 1 đáp án"}
              </Label>
            </FormItem>
          )}
        />

        {/* Đáp án */}
        <div className="space-y-2">
          <FormLabel className="font-medium text-gray-700 flex items-center justify-between">
            <span>
              Đáp án <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">(bấm vào đáp án để đánh dấu đúng)</span>
            </span>
          </FormLabel>
          
          {/* @ts-ignore deep map */}
          {form.formState.errors.questions?.[groupIndex]?.sub_questions?.[subIndex]?.correct_indexes && (
            <p className="text-[0.8rem] font-medium text-red-500">
              {/* @ts-ignore */}
              {form.formState.errors.questions[groupIndex].sub_questions[subIndex].correct_indexes.message}
            </p>
          )}

          {optionFields.map((opt, optIdx) => {
            const isCorrect = correctIndexes.includes(optIdx);
            return (
              <div key={opt.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCorrect(optIdx)}
                  className={cn("shrink-0 transition-colors", isCorrect ? "text-green-500" : "text-gray-300 hover:text-gray-400")}
                >
                  {isMulti ? (
                    isCorrect ? <CheckSquare2 className="w-5 h-5" /> : <Square className="w-5 h-5" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm font-medium text-gray-500 w-5 shrink-0">
                  {String.fromCharCode(65 + optIdx)}.
                </span>
                <FormField
                  control={form.control}
                  name={`${basePath}.options.${optIdx}` as never}
                  render={({ field }) => (
                    <FormItem className="flex-1 m-0">
                      <FormControl>
                        <Input
                          placeholder={`Đáp án ${String.fromCharCode(65 + optIdx)}`}
                          className={cn("h-9 transition-colors bg-white", isCorrect && "border-green-400 bg-green-50")}
                          {...field}
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
              variant="ghost"
              size="sm"
              className="mt-2 h-8 text-xs gap-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => appendOption("" as never)}
            >
              <Plus className="w-3.5 h-3.5" /> Thêm đáp án
            </Button>
          )}
        </div>

        {/* Giải thích */}
        <FormField
          control={form.control}
          name={`${basePath}.explanation` as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-700">Giải thích (tuỳ chọn)</FormLabel>
              <FormControl>
                <Textarea placeholder="Giải thích tại sao đáp án đó đúng..." rows={2} className="bg-white" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
