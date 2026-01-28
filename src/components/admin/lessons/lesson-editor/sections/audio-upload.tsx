import { useState } from "react";
import { Control } from "react-hook-form";
import { LessonInput } from "@/lib/schemas/lesson";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Headphones, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import FileDropzone
import FileDropzone from "../shared/file-dropzone";

interface AudioUploadProps {
  control: Control<LessonInput>;
}

export default function AudioUpload({ control }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleAudioUpload = async (file: File, onChange: (url: string) => void) => {
    try {
      setIsUploading(true);
      
      // --- LOGIC UPLOAD CẦN CHÈN VÀO ĐÂY ---
      
      // Giả lập delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUrl = `https://example.com/audio/${file.name}`;
      onChange(mockUrl);
      toast.success("Tải file nghe thành công!");
    } catch (error) {
      toast.error("Lỗi khi tải file. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">Audio bài nghe</h3>
        <p className="text-sm text-muted-foreground">Tải lên file âm thanh cho bài học (hỗ trợ MP3, WAV).</p>
      </div>
      
      <FormField
        control={control}
        name="audio_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>File Audio</FormLabel>
            <FormControl>
              <div className="space-y-4">
                
                {/* TRƯỜNG HỢP 1: ĐÃ CÓ FILE AUDIO */}
                {field.value ? (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Headphones className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-sm font-medium text-purple-900 truncate max-w-[250px]">
                              {field.value.split('/').pop() || "Audio bài học"}
                           </p>
                           <p className="text-xs text-purple-600">Đã tải lên thành công</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0 rounded-full"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Audio Player */}
                    <audio controls className="w-full h-8 block rounded outline-none shadow-sm">
                      <source src={field.value} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ phát audio.
                    </audio>
                  </div>
                ) : (
                  
                  /* TRƯỜNG HỢP 2: CHƯA CÓ FILE (HIỆN DROPZONE) */
                  <div className="relative">
                     {isUploading ? (
                        <div className="h-40 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center bg-purple-50/30">
                           <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                           <p className="text-sm font-medium text-purple-600">Đang xử lý âm thanh...</p>
                        </div>
                     ) : (
                        <FileDropzone
                          accept="audio/*" // Hoặc ".mp3,.wav,.ogg"
                          maxSizeMB={20}
                          label="Tải lên Audio"
                          helperText="Kéo thả file MP3 hoặc WAV"
                          className="border-purple-200 hover:border-purple-400 hover:bg-purple-50/50" // Custom style cho audio
                          onFileSelect={(file) => handleAudioUpload(file, field.onChange)}
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
    </div>
  );
}