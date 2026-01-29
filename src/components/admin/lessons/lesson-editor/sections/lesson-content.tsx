import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { LessonInput } from "@/lib/schemas/lesson";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, PenTool, X, File as FileIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import FileDropzone từ đường dẫn shared
import FileDropzone from "../shared/file-dropzone";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface LessonContentProps {
  form: UseFormReturn<LessonInput>;
}

export default function LessonContent({ form }: LessonContentProps) {
  const type = form.watch("type");
  const [isUploading, setIsUploading] = useState(false);

  // Hàm xử lý khi FileDropzone trả về file
  const handleFileUpload = async (file: File, onChange: (url: string) => void) => {
    try {
      setIsUploading(true);
      
      // --- LOGIC UPLOAD CẦN CHÈN VÀO ĐÂY ---
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      const url = data.url;

      // Giả lập delay upload 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Giả lập URL trả về
      onChange(url); 
      toast.success(`Đã tải lên: ${file.name}`);
    } catch (error) {
      toast.error("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">Nội dung bài học</h3>
        <p className="text-sm text-muted-foreground">Chọn hình thức bài học: Văn bản hoặc Tài liệu đính kèm.</p>
      </div>

      {/* Lựa chọn loại nội dung */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(val) => field.onChange(val)}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="text" id="type-text" className="peer sr-only" />
                  <Label
                    htmlFor="type-text"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <PenTool className="mb-3 h-6 w-6" />
                    Soạn thảo văn bản
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="file" id="type-file" className="peer sr-only" />
                  <Label
                    htmlFor="type-file"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <FileText className="mb-3 h-6 w-6" />
                    Upload tài liệu (PDF/DOCX)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="pt-2">
        {type === "text" ? (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung chi tiết</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Nhập nội dung bài học chi tiết..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="file_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tải lên tài liệu</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    
                    {/* TRƯỜNG HỢP 1: ĐÃ CÓ FILE */}
                    {field.value ? (
                      <div className="relative flex items-center p-4 border rounded-xl bg-blue-50/50 border-blue-100 transition-all">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                            <FileIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-blue-900 truncate">
                            {field.value.split('/').pop() || "Tài liệu bài học"}
                          </p>
                          <a 
                            href={field.value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline hover:text-blue-800"
                          >
                            Xem tài liệu
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      /* TRƯỜNG HỢP 2: CHƯA CÓ FILE (HIỆN DROPZONE) */
                      <div className="relative">
                        {isUploading ? (
                           <div className="h-40 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center bg-blue-50/30">
                              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                              <p className="text-sm font-medium text-blue-600">Đang tải lên...</p>
                           </div>
                        ) : (
                           <FileDropzone
                             accept=".pdf,.doc,.docx" // String theo interface
                             maxSizeMB={10}
                             label="Tải tài liệu bài học"
                             helperText="Hỗ trợ PDF, Word"
                             onFileSelect={(file) => handleFileUpload(file, field.onChange)}
                           />
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}