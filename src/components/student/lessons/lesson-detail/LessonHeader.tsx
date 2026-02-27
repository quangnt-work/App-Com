import Link from "next/link";
import { ArrowLeft, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/lesson";

interface LessonHeaderProps {
  lesson: Lesson;
}

export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <div className="bg-white border-b py-6 md:py-4">
      <div className="container mx-auto px-2">
        {/* Breadcrumb / Back Link */}
        <Link 
          href="/student/lessons" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Link>

        {/* Path */}
        <div className="text-sm text-slate-500 mb-3 flex items-center gap-2 flex-wrap">
          <span>KHÓA HỌC CỦA TÔI</span>
          <span>/</span>
          <span>{lesson.category || "Chung"}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{lesson.title}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
          {lesson.title}
        </h1>
      </div>
    </div>
  );
}