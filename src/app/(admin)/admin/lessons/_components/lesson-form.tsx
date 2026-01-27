"use client";


import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft, Save, Eye, CloudUpload, FileText,
  Trash2, Play, Plus, MoreHorizontal, LayoutList,
  CheckCircle2, Music
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";


// Import Server Action và Schema của bạn
import { upsertLesson } from "@/actions/lesson-actions";
// Giả sử schema import từ file khác, nếu chưa có phần quiz thì bạn cần mở rộng schema
import { LessonSchema } from "@/schemas";


// Mở rộng Schema tạm thời để support UI Quiz (nếu backend chưa có thì cần xử lý convert sau)
const ExtendedLessonSchema = LessonSchema.extend({
  quiz: z.array(z.object({
    question: z.string().min(1, "Nhập câu hỏi"),
    options: z.array(z.string()),
    correctAnswer: z.number()
  })).optional()
});


type LessonFormValues = z.infer<typeof ExtendedLessonSchema>;


interface LessonFormProps {
  initialData?: LessonFormValues;
  courseId: string; // Để quay lại hoặc revalidate
}


export const LessonForm = ({ initialData, courseId }: LessonFormProps) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);


  const form = useForm<LessonFormValues>({
    resolver: zodResolver(ExtendedLessonSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      content: "", // HTML content
      file_url: "",
      video_url: "",
      status: "draft", // hoặc false tuỳ db
      quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]
    },
  });


  const { fields: quizFields, append: appendQuiz, remove: removeQuiz } = useFieldArray({
    control: form.control,
    name: "quiz",
  });


  const onSubmit = async (values: LessonFormValues) => {
    // Gọi Server Action cũ
    // Lưu ý: Nếu DB chưa có bảng Quiz, bạn cần stringify mảng quiz vào 1 cột JSON hoặc xử lý riêng
    await upsertLesson(values);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
       
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <span>Trang chủ</span> <span className="mx-2">›</span>
              <span>Quản lý khóa học</span> <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Chỉnh sửa bài học</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {initialData?.title || "Thêm bài học mới"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <CloudUpload className="w-3 h-3" /> Đã lưu 2 phút trước
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" type="button">Xem trước</Button>
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Xuất bản
            </Button>
          </div>
        </div>


        {/* --- SECTION 1: THÔNG TIN CHUNG --- */}
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-blue-600">
              <div className="bg-blue-100 p-1 rounded-full"><LayoutList className="w-4 h-4" /></div>
              Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bài học</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Hành trang du lịch: Đặt vé & Sân bay" {...field} className="bg-gray-50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Học viên sẽ học các từ vựng liên quan đến..."
                      className="resize-none bg-gray-50 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>


        {/* --- SECTION 2: NỘI DUNG BÀI HỌC (TABS) --- */}
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-blue-600">
              <div className="bg-blue-100 p-1 rounded-full"><FileText className="w-4 h-4" /></div>
              Nội dung bài học
            </CardTitle>
            <FormDescription>Chọn tải lên tài liệu có sẵn hoặc soạn thảo nội dung trực tiếp.</FormDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-100 w-full justify-start p-1 h-auto rounded-md mb-6">
                <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 rounded-sm flex gap-2">
                  <CloudUpload className="w-4 h-4" /> Tài liệu tải lên (PDF, DOCX, PPTX)
                </TabsTrigger>
                <TabsTrigger value="editor" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 rounded-sm flex gap-2">
                  <FileText className="w-4 h-4" /> Soạn thảo văn bản
                </TabsTrigger>
              </TabsList>


              <TabsContent value="upload" className="space-y-6">
                {/* Drag Drop Zone */}
                <div className="border-2 border-dashed border-sky-200 rounded-xl bg-sky-50/30 p-10 text-center hover:bg-sky-50 transition cursor-pointer flex flex-col items-center justify-center gap-3">
                  <div className="bg-sky-100 p-3 rounded-full text-sky-600">
                     <CloudUpload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Tải lên bài giảng chính</h3>
                    <p className="text-sm text-gray-500 mt-1">Hỗ trợ PDF, DOCX, PowerPoint (PPTX). Tối đa 50MB.</p>
                  </div>
                  <Button variant="outline" className="mt-2 bg-white text-gray-700 hover:bg-gray-50">Chọn tập tin</Button>
                </div>


                {/* File Preview List (Mockup theo ảnh) */}
                <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded text-red-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Giao_trinh_Unit5_Travel.pdf</p>
                      <p className="text-xs text-gray-400">2.4 MB • Đã tải lên hoàn tất</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <Button size="icon" variant="ghost" className="hover:text-blue-600"><Eye className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>


                {/* Document Preview Placeholder */}
                <div className="bg-gray-100 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
                   <Eye className="w-8 h-8 opacity-50" />
                   <span className="text-sm">Xem trước nội dung tài liệu sẽ hiển thị tại đây</span>
                </div>
              </TabsContent>


              <TabsContent value="editor">
                {/* Tích hợp Rich Text Editor của bạn ở đây (ví dụ Tiptap/Quill) */}
                <Textarea placeholder="Soạn thảo nội dung bài học..." className="min-h-[300px]" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


        {/* --- SECTION 3: TÀI LIỆU NGHE (AUDIO) --- */}
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-blue-600">
              <div className="bg-blue-100 p-1 rounded-full"><Music className="w-4 h-4" /></div>
              Tài liệu nghe (Audio)
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Đang sử dụng</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 text-center hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                  <div className="bg-gray-200 p-2 rounded-full text-gray-600">
                     <CloudUpload className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Tải lên file âm thanh</span>
                    <p className="text-xs text-muted-foreground">MP3, WAV hoặc OGG (Tối đa 10MB)</p>
                  </div>
             </div>


             {/* Audio Player Mockup */}
             <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                <Button size="icon" className="rounded-full bg-sky-500 hover:bg-sky-600 w-10 h-10 shrink-0">
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                </Button>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1.5">thong_bao_san_bay_v2.mp3</p>
                  <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-1/3 rounded-full"></div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </CardContent>
        </Card>


        {/* --- SECTION 4: BÀI TẬP & TRẮC NGHIỆM --- */}
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-blue-600">
              <div className="bg-blue-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
              Bài tập & Trắc nghiệm
            </CardTitle>
            <div className="flex items-center bg-gray-100 p-1 rounded-md">
              <Button variant="ghost" size="sm" className="bg-white shadow-sm h-7 text-xs font-medium">Nhập thủ công</Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:bg-gray-200">Tải file câu hỏi</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
           
            {quizFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-white relative group">
                {/* Nút xóa câu hỏi */}
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuiz(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}


                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-sky-500 hover:bg-sky-600">Câu {index + 1}</Badge>
                  <span className="text-sm text-gray-500">Trắc nghiệm (Multiple Choice)</span>
                </div>


                <div className="space-y-4">
                  <Input
                    {...form.register(`quiz.${index}.question`)}
                    placeholder="Nhập câu hỏi tại đây..."
                    className="font-medium text-base border-gray-200 focus-visible:ring-sky-200"
                  />
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Giả lập 4 đáp án */}
                    {[0, 1, 2, 3].map((optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3 border border-gray-200 p-3 rounded-md focus-within:border-sky-300 focus-within:ring-1 focus-within:ring-sky-100 transition-all bg-white">
                        <input
                           type="radio"
                           name={`correct-${index}`}
                           defaultChecked={optIndex === 0} // Logic xử lý checked cần state riêng
                           className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                        />
                        <Input
                          {...form.register(`quiz.${index}.options.${optIndex}` as any)}
                          placeholder={`Đáp án ${optIndex + 1}`}
                          className="border-none shadow-none focus-visible:ring-0 px-0 h-auto py-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}


            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-sky-300 text-sky-600 bg-sky-50 hover:bg-sky-100"
              onClick={() => appendQuiz({ question: "", options: ["", "", "", ""], correctAnswer: 0 })}
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm câu hỏi mới
            </Button>
          </CardContent>
        </Card>


        {/* --- GLOBAL FOOTER --- */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-3 z-50">
           <Button type="button" variant="ghost" className="text-gray-600">Hủy bỏ</Button>
           <Button type="submit" className="bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200">Lưu bản nháp</Button>
        </div>


      </form>
    </Form>
  );
};