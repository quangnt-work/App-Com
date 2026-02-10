"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, FileText, Music } from "lucide-react";


// Định nghĩa kiểu dữ liệu cho bài học (Cập nhật theo schema thực tế của bạn)
interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: "VIDEO" | "TEXT" | "AUDIO"; // Ví dụ các loại bài học
  content?: string; // Nội dung HTML hoặc Text
  videoUrl?: string;
  audioUrl?: string;
  category?: string;
  duration?: number;
}


interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}


export function LessonPreviewModal({
  isOpen,
  onClose,
  lesson,
}: LessonPreviewModalProps) {
  if (!lesson) return null;


  // Hàm render nội dung dựa trên loại bài học
  const renderContent = () => {
    switch (lesson.type) {
      case "VIDEO":
        return (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {lesson.videoUrl ? (
              // Xử lý Video (Link Youtube hoặc File upload)
              lesson.videoUrl.includes("youtube") ? (
                <iframe
                  src={lesson.videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ thẻ video.
                </video>
              )
            ) : (
              <p className="text-white">Chưa có video được tải lên</p>
            )}
          </div>
        );


      case "AUDIO":
        return (
          <div className="p-6 bg-slate-50 rounded-lg border flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Music size={32} />
            </div>
            <h4 className="font-medium text-slate-700">File âm thanh bài học</h4>
            {lesson.audioUrl ? (
              <audio controls className="w-full max-w-md">
                <source src={lesson.audioUrl} />
                Trình duyệt không hỗ trợ thẻ audio.
              </audio>
            ) : (
              <p className="text-sm text-slate-500">Chưa có file audio</p>
            )}
          </div>
        );


      case "TEXT":
      default:
        return (
          <div className="prose max-w-none dark:prose-invert">
            {/* Cảnh báo: Chỉ dùng dangerouslySetInnerHTML nếu nội dung tin cậy */}
            <div dangerouslySetInnerHTML={{ __html: lesson.content || "" }} />
            {!lesson.content && (
              <p className="text-slate-400 italic">Bài học chưa có nội dung văn bản.</p>
            )}
          </div>
        );
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full h-[90vh] flex flex-col p-1">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{lesson.category || "General"}</Badge>
            <Badge variant={lesson.type === "VIDEO" ? "default" : "secondary"}>
              {lesson.type}
            </Badge>
          </div>
          <DialogTitle className="text-4xl">{lesson.title}</DialogTitle>
        </DialogHeader>


        <Separator className="shrink-0"/>


        <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                {renderContent()}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}