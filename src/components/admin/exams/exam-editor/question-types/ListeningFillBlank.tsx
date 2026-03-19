// src/components/admin/exams/exam-editor/question-types/ListeningFillBlank.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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
import { Volume2, Upload, Loader2, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ListeningFillBlankProps {
  index: number;
}

const BLANK_MARKER = "_____";

export default function ListeningFillBlank({ index }: ListeningFillBlankProps) {
  const form = useFormContext<ExamInput>();
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const audioUrl = (form.watch(`questions.${index}.audio_url` as never) as unknown) as string | undefined;
  const template = ((form.watch(`questions.${index}.transcript_template` as never) as unknown) as string) ?? "";

  // Auto-detect blanks and update correct_answers array length
  useEffect(() => {
    const blanks = template.split(BLANK_MARKER).length - 1;
    const current = ((form.getValues(`questions.${index}.correct_answers` as never) as unknown) as string[]) ?? [];
    if (current.length !== blanks) {
      const next =
        blanks > current.length
          ? [...current, ...Array(blanks - current.length).fill("")]
          : current.slice(0, blanks);
      form.setValue(`questions.${index}.correct_answers` as never, next as never, {
        shouldValidate: false,
      });
    }
  }, [template, form, index]);

  const blanks = template.split(BLANK_MARKER).length - 1;
  const correctAnswers = ((form.watch(`questions.${index}.correct_answers` as never) as unknown) as string[]) ?? [];

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
    if (!allowed.includes(file.type)) {
      toast.error("Chỉ chấp nhận file MP3, WAV, OGG, AAC");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File không được vượt quá 50MB");
      return;
    }
    setIsUploading(true);
    try {
      const supabase = createClient();
      const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `exam-audio/${Date.now()}-${sanitized}`;
      const { error } = await supabase.storage
        .from("lesson-materials")
        .upload(filePath, file, { upsert: false });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("lesson-materials").getPublicUrl(filePath);
      form.setValue(`questions.${index}.audio_url` as never, publicUrl as never, {
        shouldValidate: true,
      });
      toast.success("Tải audio thành công!");
    } catch (e: unknown) {
      toast.error("Lỗi tải audio: " + (e as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Audio Upload */}
      <div className="space-y-2">
        <FormLabel className="font-medium text-gray-700 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-purple-500" />
          File audio
        </FormLabel>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
            isUploading
              ? "border-purple-300 bg-purple-50/30"
              : audioUrl
              ? "border-green-300 bg-green-50/20"
              : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/10"
          )}
          onClick={() => !isUploading && audioRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Đang tải lên...</span>
            </div>
          ) : audioUrl ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                </div>
                <audio controls className="flex-1 h-8" src={audioUrl} />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  form.setValue(`questions.${index}.audio_url` as never, "" as never);
                }}
                className="shrink-0 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Bấm để chọn file audio</p>
                <p className="text-xs text-gray-400 mt-0.5">MP3, WAV, OGG — tối đa 50MB</p>
              </div>
            </div>
          )}
          <input
            ref={audioRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
          />
        </div>
      </div>

      {/* Transcript template */}
      <FormField
        control={form.control}
        name={`questions.${index}.transcript_template` as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-gray-700">
              Transcript có chỗ trống <span className="text-red-500">*</span>
            </FormLabel>
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 mb-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Sử dụng <code className="font-mono bg-blue-100 px-1 rounded">_____</code> (5 dấu gạch) để đánh dấu chỗ trống. Ví dụ:{" "}
                <em>He _____ to school every day.</em>
              </span>
            </div>
            <FormControl>
              <Textarea
                placeholder="He _____ to school every day. She _____ a doctor."
                rows={4}
                className="font-mono text-sm resize-y"
                {...(field as object)}
              />
            </FormControl>
            <FormMessage />
            {blanks > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Đã phát hiện{" "}
                <span className="font-semibold text-orange-600">{blanks}</span> chỗ trống.
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Đáp án cho từng chỗ trống */}
      {blanks > 0 && (
        <div className="space-y-3">
          <FormLabel className="font-medium text-gray-700">
            Đáp án điền vào chỗ trống <span className="text-red-500">*</span>
          </FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: blanks }).map((_, blankIdx) => (
              <div key={blankIdx} className="flex items-center gap-2">
                <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                  {blankIdx + 1}
                </span>
                <Input
                  placeholder={`Đáp án chỗ ${blankIdx + 1}`}
                  className="h-9 flex-1"
                  value={correctAnswers[blankIdx] ?? ""}
                  onChange={(e) => {
                    const updated = [...correctAnswers];
                    updated[blankIdx] = e.target.value;
                    form.setValue(
                      `questions.${index}.correct_answers` as never,
                      updated as never,
                      { shouldValidate: true }
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
