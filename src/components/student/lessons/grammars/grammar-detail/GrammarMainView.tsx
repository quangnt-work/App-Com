// src/components/student/lessons/lesson-detail/LessonMainView.tsx
"use client";

import { GrammarViewer } from "./GrammarViewer";
import { GrammarAudioList } from "./GrammarAudioList"; // Component mới tách ra
import { GrammarDownloadList } from "./GrammarDownloadList"; // Component mới tách ra
import { Grammar } from "@/types/grammar";

export function GrammarMainView({ grammar }: { grammar: Grammar }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* CỘT TRÁI: Nội dung chính & Iframe */}
      <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
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

      {/* CỘT PHẢI: Audio & Tài liệu đính kèm */}
      <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6 sticky top-6">
        {/* Khối Audio */}
        <GrammarAudioList grammar={grammar} />
        
        {/* Khối File tải xuống */}
        <GrammarDownloadList grammar={grammar} />
      </div>
    </div>
  );
}