// src/components/student/lessons/lesson-detail/LessonHeader.tsx
import { Lesson } from "@/types/lesson";

interface LessonHeaderProps {
  lesson: Lesson;
}

export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <div className="bg-[#f8f9fa] pt-2 pb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Path */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap font-medium">
          <span>Khóa học</span>
          <span>›</span>
          <span>{lesson.category || "Ngữ pháp căn bản"}</span>
          <span>›</span>
          <span className="text-gray-900 font-semibold">{lesson.title}</span>
        </div>
      </div>
    </div>
  );
}