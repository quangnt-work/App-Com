"use client";

import { useState } from "react";
import { LessonTabs } from "./LessonTabs";
import { LessonViewer } from "./LessonViewer";
import { LessonDocuments } from "./LessonDocuments";
import { Lesson } from "@/types/lesson";

export function LessonMainView({ lesson }: { lesson: Lesson }) {
  // Mặc định luôn mở tab Nội dung bài học
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="w-full">
      {/* Truyền state và hàm update state vào Tabs */}
      <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Hiển thị nội dung dựa trên Tab đang active */}
      <div className="mt-6">
        {activeTab === "content" && <LessonViewer lesson={lesson} />}
        
        {activeTab === "documents" && <LessonDocuments lesson={lesson} />}
        
        {activeTab === "practice" && (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm text-slate-500 italic">
            Tính năng làm bài tập trực tiếp đang được phát triển. Vui lòng quay lại sau!
          </div>
        )}
      </div>
    </div>
  );
}