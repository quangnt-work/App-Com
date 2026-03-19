// src/components/admin/exams/exam-editor/sections/ExamGeneralInfo.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ExamInput, EXAM_TYPE_LABELS, EXAM_LEVEL_LABELS } from "@/lib/schemas/exam";
import { Clock, FileText, Tag, AlignLeft, BarChart } from "lucide-react";

interface ExamGeneralInfoProps {
  isEditing?: boolean;
}

export default function ExamGeneralInfo({ isEditing }: ExamGeneralInfoProps) {
  const form = useFormContext<ExamInput>();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-500" />
          Thông tin đề thi
        </h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Tên đề thi */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                Tên đề thi <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Đề thi Ngữ pháp - Số 1"
                  {...field}
                  className="h-11"
                  disabled={isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row: Loại đề thi + Cấp độ + Thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Loại đề thi */}
          <FormField
            control={form.control}
            name="exam_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Loại đề thi <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn loại đề thi..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(EXAM_TYPE_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cấp độ */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <BarChart className="w-3.5 h-3.5 text-gray-400" />
                  Cấp độ <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn cấp độ..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(EXAM_LEVEL_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thời gian làm bài */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Thời gian làm bài <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      placeholder="60"
                      className="h-11 pr-14"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      value={field.value ?? ""}
                      disabled={isEditing}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                      phút
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mô tả */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
                Mô tả đề thi
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả nội dung, phạm vi kiến thức, đối tượng dự thi..."
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                  disabled={isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
