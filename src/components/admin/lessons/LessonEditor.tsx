"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LessonInput } from "@/types/lesson";
import { upsertLesson } from "@/actions/lesson-actions";
// Import các UI components (Input, Button, Select, etc...)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor"; // Component có sẵn của bạn
import { handleImageUpload } from "@/components/editor/ImageUploadHandler"; // Component upload ảnh của bạn

export default function LessonEditor({ initialData, isNew }: { initialData?: any, isNew: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonInput>({
    defaultValues: initialData || {
      title: "",
      type: "text", // Mặc định là bài viết
      price: 0,
      category: "GENERAL",
      status: false,
      content: "",
      file_url: "",
    },
  });

  const lessonType = form.watch("type");

  const onSubmit = (values: LessonInput) => {
    startTransition(async () => {
      const res = await upsertLesson({ ...values, id: isNew ? 'new' : initialData.id });
      if (res.error) {
        toast.error("Lỗi: " + res.error.message);
      } else {
        toast.success("Lưu thành công!");
        router.push("/admin/lessons");
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* 1. THÔNG TIN CƠ BẢN (Gộp từ Lesson cũ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
                <Label>Tên bài học</Label>
                <Input {...form.register("title")} placeholder="VD: Luyện thi IELTS Reading..." />
             </div>
             <div>
                <Label>Danh mục</Label>
                <Select onValueChange={(val) => form.setValue("category", val)} defaultValue={form.getValues("category")}>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">Tổng hợp</SelectItem>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="TIENG_NGA">Tiếng Nga</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          
          <div className="space-y-4">
             <Label>Ảnh đại diện (Thumbnail)</Label>
             {/* Component Upload Ảnh của bạn */}
             <ImageUpload 
                value={form.getValues("thumbnail")} 
                onChange={(url) => form.setValue("thumbnail", url)} 
             />
          </div>
        </div>

        {/* 2. NỘI DUNG BÀI HỌC (Logic từ Lesson cũ) */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-bold text-lg">Nội dung bài học</h3>
          
          <div className="w-1/3">
            <Label>Loại nội dung</Label>
            <Select onValueChange={(val: any) => form.setValue("type", val)} defaultValue={lessonType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Bài viết (Soạn thảo)</SelectItem>
                <SelectItem value="file">Tài liệu (PDF/Word)</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Render có điều kiện dựa trên Type */}
          {lessonType === 'text' && (
             <div className="space-y-2">
               <Label>Nội dung chi tiết</Label>
               <RichTextEditor 
                 content={form.getValues("content") || ""} 
                 onChange={(html) => form.setValue("content", html)} 
               />
             </div>
          )}

          {lessonType === 'file' && (
             <div className="space-y-2">
               <Label>Link file tài liệu</Label>
               <Input {...form.register("file_url")} placeholder="https://..." />
               {/* Có thể thay bằng Component Upload File để tự động điền URL */}
             </div>
          )}
        </div>

        {/* 3. TRẠNG THÁI */}
        <div className="flex items-center gap-4 border-t pt-6">
           <Label>Trạng thái công khai</Label>
           <Switch 
             checked={form.watch("status")} 
             onCheckedChange={(val) => form.setValue("status", val)} 
           />
           <span className="text-sm text-gray-500">{form.watch("status") ? "Đang bán/hiển thị" : "Nháp (Ẩn)"}</span>
        </div>

        <div className="flex justify-end gap-3 pt-4">
           <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
           <Button type="submit" disabled={isPending}>{isPending ? "Đang lưu..." : "Lưu bài học"}</Button>
        </div>

      </form>
    </div>
  );
}