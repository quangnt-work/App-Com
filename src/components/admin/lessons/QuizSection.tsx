import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index của đáp án đúng (0-3)
}

interface Props {
  questions: Question[];
  setQuestions: (q: Question[]) => void;
}

export default function QuizSection({ questions, setQuestions }: Props) {
  const addQuestion = () => {
    const newQ: Question = {
      id: crypto.randomUUID(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQs = [...questions];
    (newQs[index] as any)[field] = value;
    setQuestions(newQs);
  };

  const updateOption = (qIndex: number, optIndex: number, val: string) => {
    const newQs = [...questions];
    newQs[qIndex].options[optIndex] = val;
    setQuestions(newQs);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-500" /> Bài tập & Trắc nghiệm
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative group">
            <Button 
              size="icon" variant="ghost" 
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded">Câu {qIdx + 1}</span>
            </div>
            
            <Input 
              className="bg-white mb-4 font-medium border-sky-100 focus:border-sky-500" 
              placeholder="Nhập câu hỏi..." 
              value={q.text}
              onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-white ${q.correctAnswer === oIdx ? 'border-sky-500 ring-1 ring-sky-500' : 'border-slate-200'}`}>
                  <div 
                    className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${q.correctAnswer === oIdx ? 'border-sky-500' : 'border-slate-300'}`}
                    onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                  >
                    {q.correctAnswer === oIdx && <div className="w-2 h-2 bg-sky-500 rounded-full" />}
                  </div>
                  <input 
                    className="flex-1 outline-none text-sm bg-transparent" 
                    placeholder={`Đáp án ${oIdx + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div 
          onClick={addQuestion}
          className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center hover:bg-slate-50 hover:border-sky-300 transition-all cursor-pointer text-slate-500 hover:text-sky-600 gap-2 font-bold text-sm"
        >
          <Plus className="w-5 h-5" /> Thêm câu hỏi mới
        </div>
      </div>
    </div>
  );
}