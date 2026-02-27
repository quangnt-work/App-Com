"use client";

import { useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Headphones, BookOpen, FileDown, PlaySquare, Maximize } from "lucide-react";
import { Lesson } from "@/types/lesson";

interface LessonViewerProps {
  lesson: Lesson;
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  // Ref để điều khiển thẻ div bọc ngoài iframe
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  
  const lessonType = lesson.type?.toUpperCase() || "TEXT";

  // Hàm xử lý phóng to toàn màn hình
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

  switch (lessonType) {
    case "FILE":
      if (!lesson.file_url) return <EmptyState />;
      
      const fileUrlLower = lesson.file_url.toLowerCase();
      const isPowerPoint = fileUrlLower.includes(".ppt") || fileUrlLower.includes(".pptx");
      const isPdf = fileUrlLower.includes(".pdf");

      return (
        // Thêm ref và class 'group' để xử lý hover hiện nút
        <div 
          ref={iframeContainerRef}
          className="w-full bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[85vh] min-h-[600px] relative group flex flex-col"
        >
            {/* Nút Phóng to tùy chỉnh (Chỉ hiện khi là PDF hoặc PPTX) */}
            {(isPowerPoint || isPdf) && (
              <button
                onClick={handleFullScreen}
                className="absolute top-4 right-8 p-2 bg-slate-800/70 hover:bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-2 shadow-lg"
                title="Phóng to toàn màn hình"
              >
                <Maximize size={18} />
                <span className="text-sm font-medium">Toàn màn hình</span>
              </button>
            )}

            {isPowerPoint && (
              <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(lesson.file_url)}`} className="w-full flex-1" frameBorder="0" allowFullScreen />
            )}
            
            {isPdf && (
              <iframe src={`${lesson.file_url}#view=FitH`} className="w-full flex-1" frameBorder="0" allowFullScreen />
            )}
            
            {(!isPowerPoint && !isPdf) && (
              <div className="flex items-center justify-center h-full flex-col gap-4 text-slate-500 bg-white">
                <FileDown size={48} className="text-slate-300" />
                <p>Định dạng không hỗ trợ xem trước trực tiếp. Vui lòng sang tab Tài liệu để tải xuống.</p>
              </div>
            )}
        </div>
      );

    case "AUDIO":
      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-sky-50 p-2.5 rounded-lg text-sky-600">
              <Headphones size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Phần Nghe (Listening)</h3>
          </div>
          {lesson.audio_url ? (
            <div className="w-full bg-[#F8F9FA] rounded-xl p-4 md:p-6 border border-slate-100">
              <audio controls className="w-full outline-none"><source src={lesson.audio_url} /></audio>
            </div>
          ) : <EmptyState message="Chưa có file âm thanh." />}
        </div>
      );

    case "VIDEO":
      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-50 p-2.5 rounded-lg text-red-600">
              <PlaySquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Video Bài Giảng</h3>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
            {lesson.file_url ? (
              lesson.file_url.includes("youtube") ? (
                <iframe src={lesson.file_url.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen />
              ) : <video controls className="w-full h-full"><source src={lesson.file_url} type="video/mp4" /></video>
            ) : <EmptyState message="Chưa có video được tải lên" />}
          </div>
        </div>
      );

    case "TEXT":
    default:
      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Bài Đọc (Reading Passage)</h3>
          </div>
          <div className="prose max-w-none text-slate-700">
            {lesson.content ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content) }} /> : <EmptyState message="Bài học chưa có nội dung văn bản." />}
          </div>
        </div>
      );
  }
}

function EmptyState({ message = "Chưa có dữ liệu bài học." }: { message?: string }) {
  return <div className="flex flex-col items-center justify-center p-12 text-slate-400 italic">{message}</div>;
}