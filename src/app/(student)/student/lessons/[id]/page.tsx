import { notFound } from "next/navigation";
import { LessonRepository } from "@/repositories/lesson-repository";
import { LessonHeader } from "@/components/student/lessons/lesson-detail/LessonHeader"; 
import { LessonMainView } from "@/components/student/lessons/lesson-detail/LessonMainView"; // Import MainView
import { Lesson } from "@/types/lesson";

interface LessonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonDetailPage(props: LessonDetailPageProps) {
  const params = await props.params;
  const response = await LessonRepository.getById(params.id);
  const lesson: Lesson | null = response?.data;

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      {/* 1. Header tĩnh (Hiển thị tiêu đề, thời gian...) */}
      <LessonHeader lesson={lesson} />

      {/* 2. Khối nội dung động (Bao gồm Tabs và logic hoán đổi Iframe/Tài liệu) */}
      <div className="container mx-auto px-4 max-w-6xl mt-6">
        <LessonMainView lesson={lesson} />
      </div>
    </div>
  );
}