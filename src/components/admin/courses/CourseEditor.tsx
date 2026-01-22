// src/components/admin/courses/CourseEditor.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng

import { CourseSchema, CourseInput } from "@/lib/schemas/course";
import { upsertCourse } from "@/actions/course-actions"; // Server Action bạn đã viết

// UI Components (Giả định import từ Shadcn UI)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseEditorProps {
  initialData?: CourseInput | null;
}

export default function CourseEditor({ initialData }: CourseEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Setup Form với React Hook Form & Zod
  const form = useForm<CourseInput>({
    resolver: zodResolver(CourseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "TIENG_ANH",
      price: 0,
      is_published: false,
      thumbnail: "",
    },
  });

  // 2. Handle Submit
  const onSubmit = (values: CourseInput) => {
    startTransition(async () => {
      // Gọi Server Action
      const result = await upsertCourse(values);

      if (result.error) {
        toast.error("Có lỗi xảy ra", { description: JSON.stringify(result.error) });
      } else {
        toast.success(initialData ? "Cập nhật thành công!" : "Tạo mới thành công!");
        router.push("/admin/courses"); // Quay về danh sách
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {initialData ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
        </h2>
        <p className="text-muted-foreground">Điền thông tin chi tiết cho khóa học.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: Luyện thi IELTS Speaking..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TIENG_ANH">Tiếng Anh</SelectItem>
                    <SelectItem value="TIENG_NGA">Tiếng Nga</SelectItem>
                    <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                    <SelectItem value="KHAC">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá khóa học (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>Nhập 0 nếu là khóa học miễn phí.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả ngắn</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả nội dung khóa học..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Published Checkbox */}
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Công khai khóa học</FormLabel>
                  <FormDescription>
                    Khóa học sẽ hiển thị trên trang chủ nếu được tích chọn.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button disabled={isPending} type="submit">
              {isPending ? "Đang lưu..." : (initialData ? "Cập nhật" : "Tạo mới")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}