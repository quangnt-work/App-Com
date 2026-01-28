// components/lessons/sections/quiz-builder.tsx
import { HelpCircle, Plus } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizBuilderProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export default function QuizBuilder({ questions, onChange }: QuizBuilderProps) {
  
  const addQuestion = () => {
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0
    };
    onChange([...questions, newQ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQs = [...questions];
    newQs[index] = { ...newQs[index], [field]: value };
    onChange(newQs);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQs = [...questions];
    newQs[qIndex].options[optIndex] = value;
    onChange(newQs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg text-gray-800">Bài tập & Trắc nghiệm</h3>
        </div>
        <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
             <button className="px-3 py-1 bg-white shadow-sm rounded">Nhập thủ công</button>
             <button className="px-3 py-1 text-gray-500">Tải file câu hỏi</button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">Câu {qIdx + 1}</span>
              <span className="text-sm text-gray-500 font-medium">Trắc nghiệm (Multiple Choice)</span>
            </div>

            {/* Input câu hỏi */}
            <input
              className="w-full mb-4 px-3 py-2 border rounded bg-white"
              placeholder="Nhập nội dung câu hỏi..."
              value={q.question}
              onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
            />

            {/* Grid đáp án */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2 bg-white border rounded px-3 py-2">
                  <input 
                    type="radio" 
                    name={`correct-${q.id}`} 
                    checked={q.correct_answer === optIdx}
                    onChange={() => updateQuestion(qIdx, 'correct_answer', optIdx)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    className="flex-1 outline-none text-sm"
                    placeholder={`Đáp án ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Nút thêm mới */}
        <button 
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Thêm câu hỏi mới
        </button>
      </div>
    </div>
  );
}