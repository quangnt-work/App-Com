// src/components/admin/exams/exam-editor/ExamForm.tsx
"use client";

import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExamSchema, ExamInput } from "@/lib/schemas/exam";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertExam } from "@/actions/ExamActions";
import { ClipboardList, Loader2, Save, ArrowLeft } from "lucide-react";
import ExamGeneralInfo from "./sections/ExamGeneralInfo";
import QuestionBuilder from "./sections/QuestionBuilder";

interface ExamFormProps {
  initialData?: Partial<ExamInput> & { id?: string };
  isEditing?: boolean;
}

const defaultValues: ExamInput = {
  title: "",
  exam_type: "grammar",
  level: "all",
  duration: 60,
  description: "",
  status: false,
  questions: [],
};

export default function ExamForm({ initialData, isEditing }: ExamFormProps) {
  const router = useRouter();

  const form = useForm<ExamInput>({
    resolver: zodResolver(ExamSchema),
    defaultValues: initialData
      ? { ...defaultValues, ...initialData }
      : defaultValues,
    mode: "onChange",
  });


  const { isSubmitting } = form.formState;

  async function onSubmit(values: ExamInput) {
    try {
      const result = await upsertExam(values, initialData?.id);
      if (result.success) {
        toast.success(isEditing ? "Đã cập nhật đề thi" : "Đã tạo đề thi mới");
        router.push("/admin/exams");
        router.refresh();
      } else {
        toast.error(result.message || "Lỗi khi lưu");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    }
  }

  function onInvalid(errors: FieldErrors<ExamInput>) {
    console.error("Validation errors (detailed):", JSON.stringify(errors, null, 2));
    toast.error("Vui lòng kiểm tra lại thông tin và câu hỏi.");
  }

  return (
    <Form {...form}>
      <div className="py-6 px-4">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* ── HEADER GIỐNG FILE MINH HỌA ─────────────────────────────────────────────── */}
            <div className="border-b bg-gray-50/40 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-orange-500" />
                      {isEditing ? "Chỉnh sửa đề thi" : "Thêm đề thi mới"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Điền thông tin và thêm câu hỏi cho đề thi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {/* Status Toggle */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 border-r pr-4 border-gray-200">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="exam-status"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="exam-status"
                          className="text-sm font-medium cursor-pointer text-gray-700 select-none whitespace-nowrap"
                        >
                          {field.value ? "Công khai" : "Lưu nháp"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin/exams")}
                      disabled={isSubmitting}
                      className="h-9"
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-9 min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {isEditing ? "Lưu lại" : "Tạo mới"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BODY ──────────────────────────────────────────────────────── */}
            <div className="p-6 md:p-8 space-y-6">

              {/* Thông tin đề thi */}
              <ExamGeneralInfo />

              {/* Danh sách câu hỏi */}
              <QuestionBuilder />

            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}
