// src/components/admin/lessons/videos/VideoForm.tsx
"use client";

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
import { ArrowLeft, Loader2, Save, Upload, X, Youtube, Video } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { uploadFileToStorage } from "@/lib/upload";

// =================================================================
//   SCHEMA — Bỏ category và duration
// =================================================================
const VideoFormSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    file_url: z.string().optional().nullable(),
    status: z.boolean(),
});

type VideoFormValues = z.infer<typeof VideoFormSchema>;

interface VideoFormProps {
    initialData?: Partial<VideoFormValues>;
    isEditing?: boolean;
}

export default function VideoForm({ initialData, isEditing }: VideoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [thumbFileName, setThumbFileName] = useState<string | null>(
        initialData?.thumbnail ? "Thumbnail đã có" : null
    );
    const thumbInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<VideoFormValues>({
        resolver: zodResolver(VideoFormSchema),
        defaultValues: {
            id: initialData?.id,
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            thumbnail: initialData?.thumbnail ?? "",
            file_url: initialData?.file_url ?? "",
            status: (typeof initialData?.status === "boolean" ? initialData.status : false) as boolean,
        },
    });

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ chấp nhận file .jpg, .png, .webp");
            return;
        }
        toast.info("Đang tải thumbnail...");
        const url = await uploadFileToStorage(file, "lesson-materials", "thumbnails");
        if (url) {
            form.setValue("thumbnail", url, { shouldValidate: true });
            setThumbFileName(file.name);
            toast.success("Tải thumbnail thành công!");
        }
    };

    function onSubmit(values: VideoFormValues) {
        startTransition(async () => {
            try {
                const result = await upsertGrammar({
                    title: values.title,
                    type: "video",
                    status: values.status,
                    id: values.id,
                    description: values.description ?? undefined,
                    thumbnail: values.thumbnail ?? undefined,
                    file_url: values.file_url ?? undefined,
                    content: "",
                    audio_url: null,
                    questions: [],
                }, values.id);

                if (result.success) {
                    toast.success(isEditing ? "Đã cập nhật video" : "Đã tạo video mới");
                    router.push("/admin/lessons/videos");
                    router.refresh();
                } else {
                    toast.error(result.message || "Lỗi khi lưu");
                }
            } catch {
                toast.error("Lỗi hệ thống");
            }
        });
    }

    const watchedFileUrl = form.watch("file_url");
    const isYouTube = watchedFileUrl?.includes("youtube") || watchedFileUrl?.includes("youtu.be");

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
                                            <Video className="h-5 w-5 text-rose-500" />
                                            {isEditing ? "Chỉnh sửa video" : "Thêm video mới"}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mt-0.5">Điền thông tin bên dưới</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 self-end sm:self-auto">
                                    <FormField control={form.control} name="status"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2 space-y-0 border-r pr-4 border-gray-200">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} id="video-status" />
                                                </FormControl>
                                                <FormLabel htmlFor="video-status" className="text-sm font-medium cursor-pointer text-gray-700 select-none">
                                                    {field.value ? "Công khai" : "Lưu nháp"}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" onClick={() => router.back()}
                                            disabled={isPending} className="h-9">Hủy bỏ</Button>
                                        <Button type="submit" disabled={isPending} className="h-9 min-w-[100px]">
                                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
                                        <FormLabel className="font-semibold text-gray-700">
                                            Tiêu đề video <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: Bài giảng ngữ pháp cơ bản" {...field} className="h-11" />
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
                                            <Textarea placeholder="Mô tả ngắn về nội dung video..." rows={2}
                                                {...field} value={field.value ?? ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            {/* URL Video */}
                            <FormField control={form.control} name="file_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700 flex items-center gap-2">
                                            <Youtube className="w-4 h-4 text-red-500" />
                                            URL Video <span className="text-xs font-normal text-gray-400">(YouTube hoặc link MP4)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.youtube.com/watch?v=... hoặc link MP4"
                                                {...field} value={field.value ?? ""} className="h-11"
                                            />
                                        </FormControl>
                                        {isYouTube && (
                                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <Youtube className="w-3 h-3" /> Nhận diện YouTube link
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            {/* Thumbnail */}
                            <div className="space-y-2">
                                <FormLabel className="font-semibold text-gray-700 block">
                                    Thumbnail <span className="text-xs font-normal text-gray-400">(ảnh bìa — tuỳ chọn)</span>
                                </FormLabel>

                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Kéo thả hoặc bấm để tải ảnh bìa lên"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            thumbInputRef.current?.click();
                                        }
                                    }}
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-rose-300 transition-colors bg-rose-50/10 cursor-pointer"
                                    onClick={() => thumbInputRef.current?.click()}
                                >
                                    {thumbFileName ? (
                                        <div className="flex items-center justify-center gap-3 text-rose-700">
                                            <span className="text-sm font-medium truncate max-w-[250px]">{thumbFileName}</span>
                                            <button type="button" aria-label="Xóa ảnh bìa đính kèm" onClick={(e) => {
                                                e.stopPropagation();
                                                form.setValue("thumbnail", "");
                                                setThumbFileName(null);
                                            }} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Bấm để chọn ảnh bìa</p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
                                        </>
                                    )}
                                    <input ref={thumbInputRef} type="file" accept="image/*"
                                        className="hidden" onChange={handleThumbnailUpload} />
                                </div>

                                {/* URL ảnh thủ công */}
                                <FormField control={form.control} name="thumbnail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-gray-500">Hoặc dán URL ảnh</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        if (e.target.value) setThumbFileName("URL tùy chỉnh");
                                                        else setThumbFileName(null);
                                                    }} className="h-10 text-sm" />
                                            </FormControl>
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
