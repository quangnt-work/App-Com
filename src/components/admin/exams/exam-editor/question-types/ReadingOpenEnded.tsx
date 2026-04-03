// src/components/admin/exams/exam-editor/question-types/ReadingOpenEnded.tsx
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
import RichTextEditor from "@/components/ui/rich-text-editor";
import { ExamInput } from "@/lib/schemas/exam";
import { BookOpen, MessageSquare } from "lucide-react";

interface ReadingOpenEndedProps {
  index: number;
}

export default function ReadingOpenEnded({ index }: ReadingOpenEndedProps) {
  const form = useFormContext<ExamInput>();

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
              <RichTextEditor
                placeholder="Nhập đoạn văn cần đọc..."
                value={(field as any).value || ""}
                onChange={(field as any).onChange}
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
            <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
              Câu hỏi <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nhập câu hỏi theo bài đọc..."
                className="h-10"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Đáp án mẫu */}
      <FormField
        control={form.control}
        name={`questions.${index}.sample_answer` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">
              Đáp án mẫu / gợi ý (tuỳ chọn)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Đáp án mẫu để người chấm thi hoặc hệ thống tham khảo..."
                rows={3}
                {...(field as object)}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
