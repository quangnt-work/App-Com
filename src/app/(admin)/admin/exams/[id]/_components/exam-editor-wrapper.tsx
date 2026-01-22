'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExamSettingsTab } from "./exam-settings-tab";
import { QuestionsManagerTab } from "./questions-manager-tab";
import { QuestionItem } from "@/types/exam-custom";
import { upsertExam } from "@/actions/exam-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ExamEditorWrapperProps {
  initialData?: any; // Dữ liệu từ DB
}

export function ExamEditorWrapper({ initialData }: ExamEditorWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State 1: Thông tin cơ bản
  const [basicInfo, setBasicInfo] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration_minutes || 60,
    is_published: initialData?.is_published || false,
  });

  // State 2: Danh sách câu hỏi (Parse từ JSON ban đầu)
  const [questions, setQuestions] = useState<QuestionItem[]>(
    (initialData?.questions as QuestionItem[]) || []
  );

  const onSave = async () => {
    try {
      setLoading(true);
      await upsertExam({
        id: initialData?.id || 'new',
        title: basicInfo.title,
        description: basicInfo.description,
        duration_minutes: basicInfo.duration,
        is_published: basicInfo.is_published,
        questions: questions,
      });
      toast.success("Lưu đề thi thành công");
      router.push("/admin/exams");
    } catch (error) {
      toast.error("Lỗi khi lưu đề thi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chỉnh sửa đề thi</h2>
        <Button onClick={onSave} disabled={loading} className="bg-sky-600 text-white">
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="settings">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="questions">Câu hỏi ({questions.length})</TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Cài đặt */}
        <TabsContent value="settings" className="mt-6">
          <ExamSettingsTab data={basicInfo} onChange={setBasicInfo} />
        </TabsContent>
        
        {/* Tab 2: Câu hỏi */}
        <TabsContent value="questions" className="mt-6">
          <QuestionsManagerTab questions={questions} setQuestions={setQuestions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}