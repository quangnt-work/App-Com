// src/app/(student)/student/lessons/[id]/page.tsx
import { notFound } from "next/navigation";
import { LessonRepository } from "@/repositories/lesson-repository";
import { LessonHeader } from "@/components/student/lessons/lesson-detail/LessonHeader";
import { LessonMainView } from "@/components/student/lessons/lesson-detail/LessonMainView";
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
    // Đổi màu nền nền cho giống thiết kế
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
      <LessonHeader lesson={lesson} />


      <div className="container mx-auto px-4 max-w-7xl mt-6">
        <LessonMainView lesson={lesson} />
      </div>
    </div>
  );
}
