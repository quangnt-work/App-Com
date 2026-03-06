"use client";

import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GrammarSchema, GrammarInput } from "@/lib/schemas/grammar";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertGrammar } from "@/actions/GrammarActions";
import {
  ArrowLeft, Loader2, Save, FileText, X, File as FileIcon, Upload,
} from "lucide-react";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface GrammarFormProps {
  initialData?: GrammarInput;
  isEditing?: boolean;
}

const defaultValues: GrammarInput = {
  title: "",
  description: "",
  type: "file",              // Luôn là 'file'
  file_url: null,
  audio_url: null,
  content: "",
  status: false,
  questions: [],
};

export default function GrammarForm({ initialData, isEditing }: GrammarFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    initialData?.file_url ? initialData.file_url.split("/").pop() || "Tài liệu đã có" : null
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<GrammarInput>({
    resolver: zodResolver(GrammarSchema),
    defaultValues: initialData
      ? { ...defaultValues, ...initialData, type: "file" }
      : defaultValues,
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // Upload file lên Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.ms-powerpoint",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Chỉ chấp nhận file PDF, DOCX, PPTX");
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
      const filePath = `lesson-files/${Date.now()}-${sanitized}`;
      const { error } = await supabase.storage
        .from("lesson-materials")
        .upload(filePath, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from("lesson-materials")
        .getPublicUrl(filePath);
      form.setValue("file_url", publicUrl, { shouldValidate: true });
      setFileName(file.name);
      toast.success("Tải tài liệu thành công!");
    } catch (e: unknown) {
      toast.error("Lỗi tải file: " + (e as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: GrammarInput) {
    try {
      const payload: GrammarInput = {
        ...values,
        type: "file",      // Bắt buộc type='file'
        content: "",       // Không có content text
        audio_url: null,
        questions: [],
      };
      const result = await upsertGrammar(payload, initialData?.id);
      if (result.success) {
        toast.success(isEditing ? "Đã cập nhật tài liệu" : "Đã tạo tài liệu mới");
        router.push("/admin/lessons/grammars");
        router.refresh();
      } else {
        toast.error(result.message || "Lỗi khi lưu");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  }

  function onInvalid(errors: FieldErrors<GrammarInput>) {
    console.error("Validation errors:", errors);
    toast.error("Vui lòng kiểm tra lại thông tin.");
  }

  const currentUrl = form.watch("file_url");

  return (
    <Form {...form}>
      <div className="py-6 px-4">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* === HEADER === */}
            <div className="border-b bg-gray-50/40 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      {isEditing ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Chỉ hỗ trợ định dạng PDF, DOCX, PPTX
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {/* Status Toggle */}
                  <FormField control={form.control} name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 border-r pr-4 border-gray-200">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} id="status-toggle" />
                        </FormControl>
                        <FormLabel htmlFor="status-toggle" className="text-sm font-medium cursor-pointer text-gray-700 select-none">
                          {field.value ? "Công khai" : "Lưu nháp"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/lessons/grammars')}
                      disabled={isSubmitting || isUploading} className="h-9">Hủy bỏ</Button>
                    <Button type="submit" disabled={isSubmitting || isUploading} className="h-9 min-w-[100px]">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isEditing ? "Lưu lại" : "Tạo mới"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* === BODY === */}
            <div className="p-6 md:p-8 space-y-6">

              {/* Tiêu đề */}
              <FormField control={form.control} name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Tiêu đề tài liệu <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Bài giảng Ngữ pháp cơ bản - Chương 1" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mô tả */}
              <FormField control={form.control} name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mô tả nội dung tài liệu..." rows={3}
                        {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField control={form.control} name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Ngữ pháp cơ bản, Từ vựng" {...field} value={field.value ?? ""} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* === FILE UPLOAD === */}
              <div className="space-y-3">
                <FormLabel className="font-semibold text-gray-700 block">
                  Tài liệu đính kèm <span className="text-red-500">*</span>
                </FormLabel>

                {/* Upload area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                                        ${isUploading ? "border-orange-300 bg-orange-50/30" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/20"}`}
                  onClick={() => !isUploading && fileRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                      <p className="text-sm font-medium text-orange-700">Đang tải lên...</p>
                    </div>
                  ) : currentUrl && fileName ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <FileIcon className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{fileName}</p>
                        <a href={currentUrl} target="_blank" rel="noreferrer"
                          className="text-xs text-orange-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                          Xem tài liệu ↗
                        </a>
                      </div>
                      <button type="button" onClick={(e) => {
                        e.stopPropagation();
                        form.setValue("file_url", "");
                        setFileName(null);
                      }} className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Kéo thả hoặc bấm để chọn file</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PPTX — tối đa 50MB</p>
                      </div>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={handleFileUpload} />
                </div>

                {/* Hidden field để lưu URL */}
                <FormField control={form.control} name="file_url"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}