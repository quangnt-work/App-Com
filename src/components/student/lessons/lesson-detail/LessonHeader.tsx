import Link from "next/link";
import { ArrowLeft, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/lesson";

interface LessonHeaderProps {
  lesson: Lesson;
}

export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <div className="bg-white border-b px-4 py-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb / Back Link */}
        <Link 
          href="/student/lessons" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách bài học
        </Link>

        {/* Path (Giả lập theo UI) */}
        <div className="text-sm text-slate-500 mb-3 flex items-center gap-2 flex-wrap">
          <span>Khóa học của tôi</span>
          <span>/</span>
          <span>{lesson.category || "Chung"}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{lesson.title}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          {lesson.title}
        </h1>

        {/* Meta info (Badges) */}
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-3 py-1">
            {lesson.category || "Tiếng Anh"}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Clock size={16} />
            <span>45 phút</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <BarChart size={16} />
            <span>Trung cấp (B1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}