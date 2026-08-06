// src/components/student/lessons/lesson-detail/LessonViewer.tsx
"use client";

import { Maximize, Minimize } from "lucide-react";
import { Grammar } from "@/types/grammar";

interface GrammarViewerProps {
  grammar: Grammar;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function GrammarViewer({ grammar, isFullscreen, onToggleFullscreen }: GrammarViewerProps) {
  const grammarType = grammar.type?.toUpperCase() || "FILE";

  if (grammarType !== "FILE" || !grammar.file_url) {
    return null; // Tạm ẩn nếu không phải file để nhúng
  }

  const fileUrlLower = grammar.file_url.toLowerCase();
  const isPowerPoint = fileUrlLower.includes(".ppt") || fileUrlLower.includes(".pptx");
  const isPdf = fileUrlLower.includes(".pdf");

  return (
    <div className={`relative w-full ${isFullscreen ? 'h-full flex-1' : ''}`}>
      {/* Khung iframe */}
      <div 
        className={`w-full bg-[#d7cbc2] overflow-hidden relative shadow-sm ${isFullscreen ? 'h-full rounded-none' : 'aspect-[16/10] rounded-3xl'}`}
      >
        {/* Nút công cụ (Fullscreen) đặt lọt lòng bên trong khung iframe */}
        <div className="absolute top-[68px] right-6 flex items-center gap-3 z-50">
           <button 
              onClick={onToggleFullscreen}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white hover:text-[#F28422] transition-colors shadow-sm"
              title="Phóng to / Thu nhỏ"
           >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
           </button>
        </div>

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
            src={`/api/pdf/${encodeURIComponent(grammar.title + '.pdf')}?url=${encodeURIComponent(grammar.file_url)}#view=FitH`} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen 
          />
        )}
      </div>
    </div>
  );
}