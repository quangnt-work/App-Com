// src/components/student/lessons/lesson-detail/LessonMainView.tsx
"use client";

import { GrammarViewer } from "./GrammarViewer";
import { Grammar } from "@/types/grammar";

export function GrammarMainView({ grammar }: { grammar: Grammar }) {
  return (
    <div className="flex flex-col gap-6 items-start w-full">
      
      {/* CỘT CHÍNH: Nội dung chính & Iframe */}
      <div className="w-full flex flex-col gap-6">
        {/* Tiêu đề lớn và Phụ đề */}
        <div>
           <h1 className="text-5xl md:text-[2rem] font-bold text-gray-900 mb-2">
            {grammar.title}
          </h1>
        </div>

        {/* Khung Iframe/Video */}
        <GrammarViewer grammar={grammar} />

        {/* Khối Mô tả bài học (Lấy từ content) */}
        {grammar.content && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mô tả bài học</h3>
            <div 
              className="text-gray-600 leading-relaxed text-[15px]"
              dangerouslySetInnerHTML={{ __html: grammar.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}