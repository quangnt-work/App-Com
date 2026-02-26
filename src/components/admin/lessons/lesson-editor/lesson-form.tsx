"use client";


import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonSchema, LessonInput } from "@/lib/schemas/lesson";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertLesson } from "@/actions/lesson-actions";
import { ArrowLeft, Loader2, Save } from "lucide-react";


// Import các section components
import GeneralInfo from "./sections/general-info";
import LessonContent from "./sections/lesson-content";
import AudioUpload from "./sections/audio-upload";
import QuizBuilder from "./sections/quiz-builder";


interface LessonFormProps {
  initialData?: LessonInput;
  isEditing?: boolean;
}


const defaultValues: LessonInput = {
  title: "",
  description: "",
  type: "text",
  file_url: null,
  audio_url: null,
  content: "",
  status: false,
  questions: [],
};


export default function LessonForm({ initialData, isEditing }: LessonFormProps) {
  console.log("Dữ liệu đầu vào:", initialData?.status, typeof initialData?.status);
  const router = useRouter();


  const form = useForm<LessonInput>({
    resolver: zodResolver(LessonSchema),
    defaultValues: initialData || defaultValues,
    mode: "onChange",
  });


  const { isSubmitting } = form.formState;


  async function onSubmit(values: LessonInput) {
    try {
      const result = await upsertLesson(values, initialData?.id);
      if (result.success) {
        toast.success(isEditing ? "Đã cập nhật bài học" : "Đã tạo bài học mới");
        router.push("/admin/lessons");
        router.refresh();
      } else {
        toast.error(result.message || "Lỗi khi lưu bài học");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  }


  function onInvalid(errors: FieldErrors<LessonInput>) {
  console.error("Lỗi Validation:", errors);
  // Đếm số lượng lỗi
  const errorCount = Object.keys(errors).length;
  toast.error(`Vui lòng kiểm tra lại ${errorCount} mục chưa hợp lệ.`);
}


  return (
    <Form {...form}>
      {/* Thêm padding top/bottom cho trang */}
      <div className="py-6 px-4">
       
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="max-w-5xl mx-auto">
         
          {/* === SINGLE FRAME CONTAINER (Khung bao toàn bộ) === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           
            {/* === HEADER SECTION (Nằm trong khung) === */}
            <div className="border-b bg-gray-50/40 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               
                {/* Left: Title & Back Button */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => router.back()}
                    className="h-8 w-8 hover:bg-gray-200/50 shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                  </Button>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                      {isEditing ? "Chỉnh sửa bài học" : "Tạo bài học mới"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Điền thông tin chi tiết vào biểu mẫu bên dưới
                    </p>
                  </div>
                </div>


                {/* Right: Actions & Status */}
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
                            id="status-toggle"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="status-toggle"
                          className="text-sm font-medium cursor-pointer text-gray-700 select-none"
                        >
                          {field.value ? "Công khai" : "Lưu nháp"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />


                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      className="h-9"
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-9 min-w-[100px]"
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


            {/* === BODY CONTENT === */}
            <div className="p-6 md:p-8 space-y-10">
             
              <GeneralInfo control={form.control} />
             
              <Separator className="bg-gray-100" />
             
              <LessonContent form={form} />
             
              <Separator className="bg-gray-100" />
             
              <AudioUpload control={form.control} />
             
              <Separator className="bg-gray-100" />
             
              <QuizBuilder control={form.control} />
             
            </div>


          </div>
        </form>
      </div>
    </Form>
  );
}