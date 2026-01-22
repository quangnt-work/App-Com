import { getExamById } from "@/actions/exam-actions";
import { ExamEditorWrapper } from "./_components/exam-editor-wrapper";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { Edit } from "lucide-react";

export default async function ExamEditPage({ params }: { params: { examId: string } }) {
  // Nếu là tạo mới
  if (params.examId === 'create') {
     return (
        <div className="p-6 max-w-5xl mx-auto">
           <AdminPageHeader title="Tạo đề thi mới" icon={Edit} />
           <ExamEditorWrapper />
        </div>
     )
  }

  // Nếu là chỉnh sửa
  const { data: exam, error } = await getExamById(params.examId);
  
  if (error || !exam) return <div>Không tìm thấy đề thi</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageHeader 
        title={`Chỉnh sửa: ${exam.title}`} 
        icon={Edit}
        description={`ID: ${exam.id}`}
      />
      <ExamEditorWrapper initialData={exam} />
    </div>
  );
}