"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DbExam, DbQuestion, UIQuestion } from "@/types";

interface ExamEditorProps {
  initialExam?: DbExam | null;
  initialQuestions?: DbQuestion[];
}

export default function ExamEditor({ initialExam, initialQuestions = [] }: ExamEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // 1. State Exam Info (Dựa trên DbExam)
  const [examData, setExamData] = useState({
    title: initialExam?.title || "",
    description: initialExam?.description || "",
    duration: initialExam?.duration || 45,
    code: initialExam?.code || `EXAM-${Date.now()}`, // Tạo code mặc định nếu chưa có
    subject: initialExam?.subject || "ENGLISH",
    level: initialExam?.level || "B1",
  });

  // 2. State Questions (Convert DbQuestion -> UIQuestion)
  // Vì 'options' từ DB về là Json, ta cần ép kiểu sang string[] để dễ thao tác trên UI
  const [questions, setQuestions] = useState<UIQuestion[]>(
    initialQuestions.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? (q.options as string[]) : ["A", "B", "C", "D"]
    }))
  );

  // -- Helpers xử lý câu hỏi --
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: "Câu hỏi mới...",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
        order_index: questions.length,
        type: "multiple_choice", // Default value từ Enum
        score: 1,
        // Các trường bắt buộc khác của DB nếu cần, gán null/default
        exam_id: null,
        created_at: new Date().toISOString(),
        difficulty: 'medium',
        explanation: null,
        media_url: null,
        parent_id: null
      }
    ]);
  };

  const updateQuestion = (index: number, field: keyof UIQuestion, value: any) => {
    const newQ = [...questions];
    newQ[index] = { ...newQ[index], [field]: value };
    setQuestions(newQ);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQ = [...questions];
    const newOpts = [...newQ[qIndex].options];
    newOpts[optIndex] = value;
    newQ[qIndex].options = newOpts;
    setQuestions(newQ);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // -- Handle Save --
  const handleSave = async () => {
    if (!examData.title) return toast.error("Vui lòng nhập tên đề thi");
    
    setLoading(true);
    try {
      // 1. Upsert Exam Header
      const examPayload = {
        title: examData.title,
        description: examData.description,
        duration: examData.duration,
        code: examData.code,
        subject: examData.subject,
        level: examData.level,
        question_count: questions.length, // Tự động cập nhật số câu
        status: initialExam?.status || 'active',
        // Update ID if exists
        ...(initialExam?.id ? { id: initialExam.id } : {})
      };

      const { data: savedExam, error: examError } = await supabase
        .from('exams')
        .upsert(examPayload as any)
        .select()
        .single();

      if (examError) throw examError;

      const examId = savedExam.id;

      // 2. Prepare Data for RPC Transaction
      // Map UIQuestion -> format Jsonb mà RPC yêu cầu
      const questionsPayload = questions.map((q, idx) => ({
        content: q.content,
        options: q.options, // Gửi mảng string, RPC sẽ cast sang jsonb
        correct_answer: q.correct_answer,
        order_index: idx,
        type: q.type || 'multiple_choice',
        score: q.score || 1,
        explanation: q.explanation || null
      }));

      // 3. Call RPC
      const { error: rpcError } = await supabase.rpc('update_exam_questions', {
        p_exam_id: examId,
        p_questions: questionsPayload as any // Cast any vì Json type definition của TS hơi cứng nhắc
      });

      if (rpcError) throw rpcError;

      toast.success("Lưu đề thi thành công!");
      router.push("/admin/exams");
      router.refresh();

    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Exam Header Form */}
      <div className="bg-white p-6 rounded shadow border space-y-4">
        <h2 className="text-lg font-bold">Thông tin chung</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tên đề thi</label>
            <input 
              className="w-full border p-2 rounded" 
              value={examData.title} onChange={(e) => setExamData({...examData, title: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mã đề (Code)</label>
            <input 
              className="w-full border p-2 rounded" 
              value={examData.code} onChange={(e) => setExamData({...examData, code: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Thời gian (phút)</label>
            <input 
              type="number" className="w-full border p-2 rounded" 
              value={examData.duration} onChange={(e) => setExamData({...examData, duration: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Trình độ</label>
            <select 
              className="w-full border p-2 rounded"
              value={examData.level} onChange={(e) => setExamData({...examData, level: e.target.value})}
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Danh sách câu hỏi ({questions.length})</h2>
          <button onClick={addQuestion} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
            + Thêm câu hỏi
          </button>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="bg-white p-6 rounded shadow border relative">
            <div className="absolute top-4 right-4 text-red-500 cursor-pointer" onClick={() => removeQuestion(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </div>
            
            <div className="mb-4">
              <label className="font-bold text-gray-700">Câu {index + 1}: Nội dung</label>
              <textarea 
                className="w-full border p-2 rounded mt-1"
                value={q.content}
                onChange={(e) => updateQuestion(index, 'content', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correct_answer === opt}
                    onChange={() => updateQuestion(index, 'correct_answer', opt)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input 
                    className={`flex-1 border p-2 rounded ${q.correct_answer === opt ? 'border-blue-500 bg-blue-50' : ''}`}
                    value={opt}
                    onChange={(e) => updateOption(index, oIdx, e.target.value)}
                    placeholder={`Đáp án ${oIdx + 1}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-2 bg-gray-50 text-sm text-gray-600 rounded">
              Giải thích (Optional):
              <input 
                className="w-full bg-transparent border-b outline-none ml-2"
                value={q.explanation || ""}
                onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                placeholder="Nhập giải thích đáp án..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 z-10 flex justify-end gap-4 shadow-lg">
         <span className="self-center font-bold text-gray-600">Tổng: {questions.length} câu | {examData.duration} phút</span>
         <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "ĐANG LƯU..." : "LƯU ĐỀ THI"}
        </button>
      </div>
      {/* Spacer để tránh button che content cuối */}
      <div className="h-24"></div>
    </div>
  );
}