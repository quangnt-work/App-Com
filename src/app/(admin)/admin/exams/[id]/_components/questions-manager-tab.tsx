'use client';

import { QuestionItem } from "@/types/exam-custom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionsManagerTabProps {
  questions: QuestionItem[];
  setQuestions: (qs: QuestionItem[]) => void;
}

export function QuestionsManagerTab({ questions, setQuestions }: QuestionsManagerTabProps) {
  
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addQuestion = () => {
    // Logic mở Modal thêm câu hỏi (Bạn cần tạo Modal component riêng)
    // Tạm thời demo thêm dummy
    const newQ: QuestionItem = {
      id: crypto.randomUUID(),
      type: 'multiple_choice',
      content: 'Câu hỏi mới...',
      points: 1,
      options: ['A', 'B', 'C', 'D'],
      correctOptionIndex: 0
    };
    setQuestions([...questions, newQ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-medium">Danh sách câu hỏi</h3>
          <p className="text-sm text-slate-500">Tổng điểm: {questions.reduce((sum, q) => sum + (q.points || 0), 0)}</p>
        </div>
        <Button onClick={addQuestion} variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
          <PlusCircle className="w-4 h-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      <div className="space-y-3">
        {questions.length === 0 && (
          <div className="text-center py-10 text-slate-400 border border-dashed rounded-md">
            Chưa có câu hỏi nào.
          </div>
        )}

        {questions.map((q, index) => (
          <Card key={q.id} className="group relative hover:shadow-md transition-all">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="mt-1 text-slate-400 cursor-move">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">Câu {index + 1}</Badge>
                  <Badge variant="outline" className="uppercase text-[10px]">{q.type}</Badge>
                  <span className="text-sm text-slate-500 ml-auto">{q.points} điểm</span>
                </div>
                <p className="font-medium text-slate-800 line-clamp-2">{q.content}</p>
                {/* Hiển thị sơ lược đáp án nếu cần */}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-slate-400 hover:text-red-600"
                onClick={() => removeQuestion(q.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}