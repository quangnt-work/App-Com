// src/components/student/lessons/lesson-detail/LessonViewer.tsx
"use client";

import { useRef } from "react";
import { Maximize, Download } from "lucide-react";
import { Lesson } from "@/types/lesson";

interface LessonViewerProps {
  lesson: Lesson;
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  
  // Logic phóng to giữ nguyên
  const handleFullScreen = () => {
    if (iframeContainerRef.current) {
      if (!document.fullscreenElement) {
        iframeContainerRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen();
      }
    }
  };

  const lessonType = lesson.type?.toUpperCase() || "FILE";

  if (lessonType !== "FILE" || !lesson.file_url) {
    return null; // Tạm ẩn nếu không phải file để nhúng
  }

  const fileUrlLower = lesson.file_url.toLowerCase();
  const isPowerPoint = fileUrlLower.includes(".ppt") || fileUrlLower.includes(".pptx");
  const isPdf = fileUrlLower.includes(".pdf");

  return (
    <div className="relative w-full">
      {/* Cụm nút công cụ góc trên bên phải */}
      <div className="absolute -top-14 right-0 flex items-center gap-3 z-10">
         <button 
            onClick={handleFullScreen}
            className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
         >
            <Maximize size={18} />
         </button>
         <a 
            href={lesson.file_url}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
         >
            <Download size={18} />
         </a>
      </div>

      {/* Khung iframe */}
      <div 
        ref={iframeContainerRef}
        className="w-full bg-[#d7cbc2] rounded-3xl overflow-hidden aspect-[16/10] relative shadow-sm"
      >
        {isPowerPoint && (
          <iframe 
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(lesson.file_url)}`} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen 
          />
        )}
        
        {isPdf && (
          <iframe 
            src={`${lesson.file_url}#view=FitH`} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen 
          />
        )}
      </div>
    </div>
  );
}