// src/app/(admin)/admin/exams/create/page.tsx
import { Metadata } from "next";
import ExamForm from "@/components/admin/exams/exam-editor/ExamForm";

export const metadata: Metadata = {
  title: "Thêm đề thi mới | Admin Dashboard",
  description: "Tạo đề thi mới cho hệ thống",
};

export default function CreateExamPage() {
  return (
    <main>
      <ExamForm isEditing={false} />
    </main>
  );
}
