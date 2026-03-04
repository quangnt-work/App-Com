//src/components/admin/lessons/grammars/GrammarPreviewModal.tsx

"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Music, FileText, Maximize } from "lucide-react";
import DOMPurify from 'isomorphic-dompurify';
import { Grammar } from "@/types/grammar";

interface GrammarPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  grammar: Grammar | null;
}

export function GrammarPreviewModal({
  isOpen,
  onClose,
  grammar,
}: GrammarPreviewModalProps) {
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  if (!grammar) return null;

  const GrammarType = grammar.type?.toUpperCase() || "TEXT";
  
  // Xác định trước định dạng file để điều hướng Layout
  const fileUrlLower = grammar.file_url?.toLowerCase() || "";
  const isPowerPoint = fileUrlLower.includes('.ppt') || fileUrlLower.includes('.pptx');
  const isPdf = fileUrlLower.includes('.pdf');
  const isFullscreenDocument = GrammarType === "FILE" && (isPowerPoint || isPdf);

  const handleFullScreen = () => {
    if (iframeContainerRef.current) {
      if (!document.fullscreenElement) {
        iframeContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Lỗi khi phóng to toàn màn hình: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const renderContent = () => {
    switch (GrammarType) {
      case "VIDEO":
        return (
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {grammar.file_url ? (
              grammar.file_url.includes("youtube") ? (
                <iframe
                  src={grammar.file_url.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={grammar.file_url} type="video/mp4" />
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
          <div className="p-6 bg-slate-50 rounded-lg border flex flex-col items-center gap-4 max-w-2xl mx-auto mt-10">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Music size={32} />
            </div>
            <h4 className="font-medium text-slate-700">File âm thanh bài học</h4>
            {grammar.audio_url ? (
              <audio controls className="w-full max-w-md">
                <source src={grammar.audio_url} />
                Trình duyệt không hỗ trợ thẻ audio.
              </audio>
            ) : (
              <p className="text-sm text-slate-500">Chưa có file audio</p>
            )}
          </div>
        );

      case "FILE":
        if (grammar.file_url) {
          if (isPowerPoint) {
            const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(grammar.file_url)}`;
            return (
              // Sử dụng h-full thay vì chiều cao cố định
              <div 
                ref={iframeContainerRef} 
                className="relative w-full h-full rounded-md overflow-hidden border bg-white group shadow-sm flex flex-col"
              >
                <button
                  onClick={handleFullScreen}
                  className="absolute top-4 right-4 p-2 bg-slate-800/70 hover:bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-2 shadow-lg"
                  title="Phóng to toàn màn hình"
                >
                  <Maximize size={18} />
                  <span className="text-sm font-medium">Toàn màn hình</span>
                </button>
                <iframe 
                  src={embedUrl} 
                  className="w-full flex-1"
                  frameBorder="0" 
                  title={grammar.title || "Tài liệu PowerPoint"}
                  allowFullScreen
                />
              </div>
            );
          }

          if (isPdf) {
            return (
              // Sử dụng h-full thay vì chiều cao cố định
              <div 
                ref={iframeContainerRef} 
                className="relative w-full h-full rounded-md overflow-hidden border bg-slate-100 group shadow-sm flex flex-col"
              >
                <button
                  onClick={handleFullScreen}
                  className="absolute top-4 right-8 p-2 bg-slate-800/70 hover:bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-2 shadow-lg"
                  title="Phóng to toàn màn hình"
                >
                  <Maximize size={18} />
                  <span className="text-sm font-medium">Toàn màn hình</span>
                </button>
                <iframe 
                  src={`${grammar.file_url}#view=FitH`} 
                  className="w-full flex-1"
                  frameBorder="0" 
                  title={grammar.title || "Tài liệu PDF"}
                  allowFullScreen
                />
              </div>
            );
          }
          
          return (
             <div className="p-10 bg-slate-50 rounded-lg border flex flex-col items-center gap-4 text-center max-w-2xl mx-auto mt-10">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={32} />
                </div>
                <h4 className="font-medium text-slate-700">Tài liệu đính kèm</h4>
                <p className="text-sm text-slate-500">Định dạng tệp này không hỗ trợ xem trực tiếp. Vui lòng tải xuống để xem nội dung.</p>
                <a 
                  href={grammar.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Tải tài liệu xuống
                </a>
             </div>
          );
        }
        
        return <p className="text-slate-500 italic text-center mt-10">Chưa có tài liệu được tải lên.</p>;

      case "TEXT":
      default:
        return (
          <div className="prose max-w-3xl mx-auto dark:prose-invert">
            {grammar.content ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(grammar.content) }} />
            ) : (
                <p className="text-slate-400 italic text-center mt-10">Bài học chưa có nội dung văn bản.</p>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Tối ưu class DialogContent: thêm overflow-hidden, gap-0 và p-0 để loại bỏ hoàn toàn khoảng trống mặc định */}
      <DialogContent className="sm:max-w-5xl w-full h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50/50">
        
        {/* Header chiếm một khoảng không gian cố định (shrink-0) */}
        <DialogHeader className="p-6 pb-4 shrink-0 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{grammar.category || "General"}</Badge>
            <Badge variant={GrammarType === "VIDEO" ? "default" : "secondary"}>
              {GrammarType}
            </Badge>
          </div>
          <DialogTitle className="text-3xl">{grammar.title}</DialogTitle>
        </DialogHeader>

        <Separator className="shrink-0"/>

        {/* Khung chứa nội dung: flex-1 sẽ tự động chiếm TẤT CẢ chiều cao còn lại */}
        {isFullscreenDocument ? (
            // Nếu là PDF/PPTX: Không dùng thanh cuộn của Modal, nhường toàn bộ khung cho Iframe
            <div className="flex-1 w-full p-2 md:p-4 overflow-hidden flex flex-col">
                {renderContent()}
            </div>
        ) : (
            // Nếu là Text/Audio/Video/Các file khác: Sử dụng ScrollArea bình thường
            <ScrollArea className="flex-1 w-full">
                <div className="p-4 md:p-6 h-full">
                    {renderContent()}
                </div>
            </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}