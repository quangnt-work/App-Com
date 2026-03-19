// src/components/admin/exams/exam-editor/question-types/ErrorCorrection.tsx
"use client";

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
import { ExamInput } from "@/lib/schemas/exam";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

interface ErrorCorrectionProps {
  index: number;
}

export default function ErrorCorrection({ index }: ErrorCorrectionProps) {
  const form = useFormContext<ExamInput>();

  return (
    <div className="space-y-4">
      {/* Câu có lỗi */}
      <FormField
        control={form.control}
        name={`questions.${index}.sentence` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Câu có lỗi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="VD: She go to school every day."
                rows={3}
                className="font-mono text-sm"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Row: Phần lỗi → Sửa lại */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-start gap-3">
        {/* Phần bị lỗi */}
        <FormField
          control={form.control}
          name={`questions.${index}.wrong_part` as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                  ✗
                </span>
                Phần bị sai <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: go"
                  className="h-10 border-red-200 focus-visible:ring-red-300 bg-red-50"
                  {...(field as object)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Arrow */}
        <div className="pt-7 flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Sửa lại đúng */}
        <FormField
          control={form.control}
          name={`questions.${index}.correct_part` as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Sửa lại đúng <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: goes"
                  className="h-10 border-green-200 focus-visible:ring-green-300 bg-green-50"
                  {...(field as object)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Giải thích */}
      <FormField
        control={form.control}
        name={`questions.${index}.explanation` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">Giải thích (tuỳ chọn)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="VD: Chủ ngữ 'She' là ngôi 3 số ít, động từ phải chia thêm -s trong thì hiện tại đơn."
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
