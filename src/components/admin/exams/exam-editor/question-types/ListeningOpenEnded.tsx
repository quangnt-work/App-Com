// src/components/admin/exams/exam-editor/question-types/ListeningOpenEnded.tsx
"use client";

import { useRef, useState } from "react";
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
import { Volume2, Upload, Loader2, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ListeningOpenEndedProps {
  index: number;
}

export default function ListeningOpenEnded({ index }: ListeningOpenEndedProps) {
  const form = useFormContext<ExamInput>();
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const audioUrl = (form.watch(`questions.${index}.audio_url` as never) as unknown) as string | undefined;

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
                className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
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
                placeholder="Nhập câu hỏi về nội dung audio..."
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
                placeholder="Đáp án tham khảo..."
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
