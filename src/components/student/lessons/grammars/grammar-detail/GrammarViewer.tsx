// src/components/student/lessons/lesson-detail/LessonViewer.tsx
"use client";

import { useRef } from "react";
import { Maximize } from "lucide-react";
import { Grammar } from "@/types/grammar";

interface GrammarViewerProps {
  grammar: Grammar;
}

export function GrammarViewer({ grammar }: GrammarViewerProps) {
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

  const grammarType = grammar.type?.toUpperCase() || "FILE";

  if (grammarType !== "FILE" || !grammar.file_url) {
    return null; // Tạm ẩn nếu không phải file để nhúng
  }

  const fileUrlLower = grammar.file_url.toLowerCase();
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
      </div>

      {/* Khung iframe */}
      <div 
        ref={iframeContainerRef}
        className="w-full bg-[#d7cbc2] rounded-3xl overflow-hidden aspect-[16/10] relative shadow-sm"
      >
        {isPowerPoint && (
          <iframe 
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(grammar.file_url)}`} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen 
          />
        )}
        
        {isPdf && (
          <iframe 
            src={`/api/pdf/${encodeURIComponent(grammar.title + '.pdf')}?url=${encodeURIComponent(grammar.file_url)}#zoom=100`} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen 
          />
        )}
      </div>
    </div>
  );
}