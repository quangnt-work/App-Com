// src/components/student/lessons/lesson-detail/LessonMainView.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { GrammarViewer } from "./GrammarViewer";
import { Grammar } from "@/types/grammar";
import { LessonNotes } from "@/components/student/lessons/notes/LessonNotes";

export function GrammarMainView({ grammar }: { grammar: Grammar }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-6 ${isFullscreen ? 'bg-white overflow-hidden' : ''}`}>
      {/* Tiêu đề bài học nằm độc lập phía trên */}
      {!isFullscreen && (
        <div>
           <h1 className="text-5xl md:text-[2rem] font-bold text-gray-900 mb-2">
            {grammar.title}
          </h1>
        </div>
      )}

      {/* ROW 1: Iframe và Ghi chú */}
      <div className={`flex flex-col xl:flex-row gap-6 w-full items-stretch ${isFullscreen ? 'h-screen p-0' : ''}`}>
        
        {/* CỘT CHÍNH: Iframe */}
        <div className={`w-full ${isFullscreen ? 'h-full' : 'xl:w-[70%]'} flex flex-col`}>
          <GrammarViewer 
            grammar={grammar} 
            isFullscreen={isFullscreen} 
            onToggleFullscreen={handleFullScreen} 
          />
        </div>

        {/* CỘT GHI CHÚ: Sẽ tự kéo dài (stretch) bằng chiều cao của Iframe */}
        <div className={`${isFullscreen ? 'absolute inset-0 pointer-events-none' : 'w-full xl:w-[30%] flex flex-col'}`}>
           <div className={`flex-1 ${isFullscreen ? 'pointer-events-auto' : ''}`}>
             <LessonNotes isFullscreen={isFullscreen} lessonId={`grammar_${grammar.id}`} />
           </div>
        </div>

      </div>

      {/* ROW 2: Mô tả bài học nằm bên dưới */}
      {(!isFullscreen && grammar.content) && (
        <div className="w-full xl:w-[70%] bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mô tả bài học</h3>
          <div 
            className="text-gray-600 leading-relaxed text-[15px]"
            dangerouslySetInnerHTML={{ __html: grammar.content }}
          />
        </div>
      )}
    </div>
  );
}