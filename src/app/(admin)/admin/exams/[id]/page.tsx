// src/app/(admin)/admin/exams/[id]/page.tsx
import { Metadata } from "next";
import ExamForm from "@/components/admin/exams/exam-editor/ExamForm";
import { getExamDetail, getExamQuestions } from "@/actions/ExamActions";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Chỉnh sửa đề thi | Admin Dashboard",
  description: "Chỉnh sửa đề thi trong hệ thống",
};

interface EditExamPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { id } = await params;

  const [examDetailRes, questionsRes] = await Promise.all([
    getExamDetail(id),
    getExamQuestions(id),
  ]);

  if (!examDetailRes.data || examDetailRes.error) {
    notFound();
  }

  const dbData = examDetailRes.data;
  const initialData = {
    id: dbData.id,
    title: dbData.title,
    exam_type: dbData.exam_type as any,
    duration: dbData.duration,
    level: dbData.level as any,
    description: dbData.description || undefined,
    status: dbData.status === "published",
    questions: (questionsRes.data || []) as any,
  };

  return (
    <main>
      <ExamForm initialData={initialData as any} isEditing={true} />
    </main>
  );
}
