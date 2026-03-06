// src/components/admin/lessons/audios/AudioForm.tsx
"use client";

import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertGrammar } from "@/actions/GrammarActions";
import {
    ArrowLeft, Loader2, Save, Upload, X, Headphones, CheckCircle, AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// =================================================================
//   SCHEMA
// =================================================================
const AudioFormSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional().nullable(),
    audio_url: z.string().optional().nullable(),
    status: z.boolean(),
});

type AudioFormValues = z.infer<typeof AudioFormSchema>;

// =================================================================
//   TYPES
// =================================================================
interface AudioFormProps {
    initialData?: Partial<AudioFormValues>;
    isEditing?: boolean;
}

interface UploadFile {
    id: string;
    file: File;
    status: "pending" | "uploading" | "done" | "error";
    url?: string;
    errorMsg?: string;
}

// =================================================================
//   COMPONENT
// =================================================================
export default function AudioForm({ initialData, isEditing }: AudioFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const [isBulkSaving, setIsBulkSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Form ---
    const form = useForm<AudioFormValues>({
        resolver: zodResolver(AudioFormSchema),
        defaultValues: {
            id: initialData?.id,
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            audio_url: initialData?.audio_url ?? "",
            status: (typeof initialData?.status === "boolean" ? initialData.status : false) as boolean,
        },
    });

    // =================================================================
    //   MULTI-FILE UPLOAD LOGIC
    // =================================================================
    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        if (!selected.length) return;

        const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4", "audio/aac"];
        const newFiles: UploadFile[] = [];
        const rejected: string[] = [];

        for (const file of selected) {
            if (!allowed.includes(file.type)) {
                rejected.push(`${file.name} (định dạng không hỗ trợ)`);
                continue;
            }
            if (file.size > 50 * 1024 * 1024) {
                rejected.push(`${file.name} (vượt quá 50MB)`);
                continue;
            }
            newFiles.push({ id: `${Date.now()}-${Math.random()}`, file, status: "pending" });
        }

        if (rejected.length > 0) toast.warning(`${rejected.length} file không hợp lệ: ${rejected.join(", ")}`);
        if (newFiles.length === 0) return;

        setUploadFiles((prev) => [...prev, ...newFiles]);

        const totalCount = uploadFiles.length + newFiles.length;
        if (totalCount === 1) {
            uploadSingle(newFiles[0]);
        } else {
            uploadAll(newFiles);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const uploadSingle = async (uf: UploadFile) => {
        setStatus(uf.id, "uploading");
        try {
            const url = await uploadToSupabase(uf.file);
            setUploadFiles((prev) => prev.map((f) => f.id === uf.id ? { ...f, status: "done", url } : f));
            form.setValue("audio_url", url, { shouldValidate: true });
            toast.success("Tải file thành công!");
        } catch (e: unknown) {
            setUploadFiles((prev) => prev.map((f) => f.id === uf.id ? { ...f, status: "error", errorMsg: (e as Error).message } : f));
            toast.error("Upload thất bại: " + (e as Error).message);
        }
    };

    const uploadAll = async (files: UploadFile[]) => {
        for (const uf of files) {
            setStatus(uf.id, "uploading");
            try {
                const url = await uploadToSupabase(uf.file);
                setUploadFiles((prev) => prev.map((f) => f.id === uf.id ? { ...f, status: "done", url } : f));
            } catch (e: unknown) {
                setUploadFiles((prev) => prev.map((f) => f.id === uf.id ? { ...f, status: "error", errorMsg: (e as Error).message } : f));
            }
        }
    };

    const uploadToSupabase = async (file: File): Promise<string> => {
        const supabase = createClient();
        const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `audios/${Date.now()}-${sanitized}`;
        const { error } = await supabase.storage.from("lesson-materials").upload(filePath, file);
        if (error) throw new Error(error.message);
        const { data: { publicUrl } } = supabase.storage.from("lesson-materials").getPublicUrl(filePath);
        return publicUrl;
    };

    const setStatus = (id: string, status: UploadFile["status"]) =>
        setUploadFiles((prev) => prev.map((f) => f.id === id ? { ...f, status } : f));

    const removeFile = (id: string) =>
        setUploadFiles((prev) => prev.filter((f) => f.id !== id));

    const isAllDone = uploadFiles.length > 0 && uploadFiles.every((f) => f.status === "done" || f.status === "error");
    const doneFiles = uploadFiles.filter((f) => f.status === "done");
    const isMultiMode = !isEditing && uploadFiles.length > 1;
    const isUploading = uploadFiles.some((f) => f.status === "uploading");

    // =================================================================
    //   SAVE ALL (Bulk create nhiều records)
    // =================================================================
    const handleSaveAll = async () => {
        if (!doneFiles.length) { toast.warning("Chưa có file nào upload thành công"); return; }
        setIsBulkSaving(true);
        const statusVal = form.getValues("status");
        const description = form.getValues("description") || "";
        let successCount = 0;
        let failCount = 0;

        for (const uf of doneFiles) {
            const title = uf.file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
            try {
                const result = await upsertGrammar({
                    title,
                    type: "audio",
                    status: statusVal,
                    description,
                    content: "",
                    file_url: null,
                    audio_url: uf.url ?? undefined,
                    questions: [],
                });
                if (result.success) successCount++;
                else failCount++;
            } catch { failCount++; }
        }

        setIsBulkSaving(false);
        if (successCount > 0) {
            toast.success(`Đã lưu ${successCount} bài nghe thành công!`);
            router.push("/admin/lessons/audios");
            router.refresh();
        }
        if (failCount > 0) toast.error(`${failCount} bài nghe lưu thất bại`);
    };

    // =================================================================
    //   SUBMIT đơn (edit mode hoặc URL thủ công)
    // =================================================================
    function onSubmit(values: AudioFormValues) {
        startTransition(async () => {
            try {
                const result = await upsertGrammar({
                    title: values.title,
                    type: "audio",
                    status: values.status,
                    id: values.id,
                    description: values.description ?? undefined,
                    content: "",
                    file_url: null,
                    audio_url: values.audio_url ?? undefined,
                    questions: [],
                }, values.id);
                if (result.success) {
                    toast.success(isEditing ? "Đã cập nhật bài nghe" : "Đã tạo bài nghe mới");
                    router.push("/admin/lessons/audios");
                    router.refresh();
                } else {
                    toast.error(result.message || "Lỗi khi lưu");
                }
            } catch { toast.error("Lỗi hệ thống"); }
        });
    }

    // =================================================================
    //   RENDER
    // =================================================================
    return (
        <Form {...form}>
            <div className="py-6 px-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* === HEADER === */}
                        <div className="border-b bg-gray-50/40 px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                                            <Headphones className="h-5 w-5 text-sky-500" />
                                            {isEditing ? "Chỉnh sửa bài nghe" : "Thêm bài nghe"}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {isEditing
                                                ? "Cập nhật thông tin bài nghe"
                                                : "Upload 1 hoặc nhiều file audio cùng lúc"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 self-end sm:self-auto">
                                    <FormField control={form.control} name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2 space-y-0 border-r pr-4 border-gray-200">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} id="audio-status" />
                                                </FormControl>
                                                <FormLabel htmlFor="audio-status" className="text-sm font-medium cursor-pointer text-gray-700 select-none">
                                                    {field.value ? "Công khai" : "Lưu nháp"}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" onClick={() => router.push('/admin/lessons/audios')}
                                            disabled={isPending || isUploading || isBulkSaving} className="h-9">
                                            Hủy bỏ
                                        </Button>
                                        {isMultiMode ? (
                                            <Button type="button" disabled={!isAllDone || isBulkSaving}
                                                onClick={handleSaveAll} className="h-9 min-w-[130px] bg-sky-600 hover:bg-sky-700">
                                                {isBulkSaving
                                                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    : <Save className="mr-2 h-4 w-4" />}
                                                Lưu {doneFiles.length} bài nghe
                                            </Button>
                                        ) : (
                                            <Button type="submit" disabled={isPending || isUploading} className="h-9 min-w-[100px]">
                                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                                {isEditing ? "Lưu lại" : "Tạo mới"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* === BODY === */}
                        <div className="p-6 md:p-8 space-y-6">

                            {/* Tiêu đề — ẩn khi multi-mode (lấy từ tên file) */}
                            {!isMultiMode && (
                                <FormField control={form.control} name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold text-gray-700">
                                                Tiêu đề <span className="text-red-500">*</span>
                                                {!isEditing && uploadFiles.length === 0 && (
                                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                                        (Upload nhiều file → tiêu đề lấy từ tên file)
                                                    </span>
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: Hội thoại tại sân bay" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Mô tả */}
                            <FormField control={form.control} name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả ngắn về nội dung bài nghe..." rows={2}
                                                {...field} value={field.value ?? ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            {/* === UPLOAD AREA === */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="font-semibold text-gray-700 block">
                                        File Audio
                                        <span className="ml-2 text-xs font-normal text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                                            Hỗ trợ upload nhiều file
                                        </span>
                                    </FormLabel>
                                    {uploadFiles.length > 0 && (
                                        <button type="button" onClick={() => setUploadFiles([])}
                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                                            Xóa tất cả
                                        </button>
                                    )}
                                </div>

                                {/* Drop zone */}
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-sky-300 hover:bg-sky-50/20 transition-all cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Kéo thả hoặc bấm để chọn</p>
                                    <p className="text-xs text-gray-400 mt-1">MP3, WAV, OGG, AAC — tối đa 50MB/file</p>
                                    <Button type="button" variant="outline" size="sm" className="mt-3 pointer-events-none">
                                        <Upload className="w-3 h-3 mr-1" /> Chọn file audio
                                    </Button>
                                    <input ref={fileInputRef} type="file" accept="audio/*" multiple
                                        className="hidden" onChange={handleFilesSelected} />
                                </div>

                                {/* File list */}
                                {uploadFiles.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {uploadFiles.map((uf) => (
                                            <div key={uf.id}
                                                className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors
                                                    ${uf.status === "done" ? "bg-green-50 border-green-200" :
                                                        uf.status === "error" ? "bg-red-50 border-red-200" :
                                                            uf.status === "uploading" ? "bg-sky-50 border-sky-200 animate-pulse" :
                                                                "bg-gray-50 border-gray-200"}`}>
                                                <Headphones className={`w-4 h-4 shrink-0 ${uf.status === "done" ? "text-green-600" :
                                                    uf.status === "error" ? "text-red-500" :
                                                        uf.status === "uploading" ? "text-sky-500" : "text-gray-400"}`} />
                                                <span className="flex-1 truncate text-gray-700 font-medium">{uf.file.name}</span>
                                                <span className="text-xs text-gray-400 shrink-0">
                                                    {(uf.file.size / 1024 / 1024).toFixed(1)} MB
                                                </span>
                                                {uf.status === "uploading" && <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />}
                                                {uf.status === "done" && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                                                {uf.status === "error" && (
                                                    <span title={uf.errorMsg}>
                                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                    </span>
                                                )}
                                                {uf.status !== "uploading" && (
                                                    <button type="button" onClick={() => removeFile(uf.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-0.5 rounded">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Summary */}
                                        {isAllDone && (
                                            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 px-1">
                                                <span>
                                                    <span className="text-green-600 font-medium">{doneFiles.length} thành công</span>
                                                    {uploadFiles.filter(f => f.status === "error").length > 0 && (
                                                        <span className="text-red-500 font-medium ml-2">
                                                            {uploadFiles.filter(f => f.status === "error").length} lỗi
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* URL trực tiếp (chỉ khi không multi) */}
                                {!isMultiMode && (
                                    <FormField control={form.control} name="audio_url"
                                        render={({ field }) => (
                                            <FormItem className="mt-2">
                                                <FormLabel className="text-xs text-gray-500">Hoặc dán URL trực tiếp</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value ?? ""}
                                                        className="h-10 text-sm" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Form>
    );
}
