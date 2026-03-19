// src/components/student/exams/attempt/ExamAttemptClient.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, HelpCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { submitExam } from '@/actions/examSubmissions';
import { toast } from 'sonner';

export function ExamAttemptClient({ exam, questions, user }: any) {
  const router = useRouter();

  const totalSeconds = (exam.duration || 60) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Prevent accidental navigation
  useEffect(() => {
    // Push a new state so the back button won't immediately leave the page
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      // User clicked back
      e.preventDefault();
      // Push state again so we stay on the page
      window.history.pushState(null, '', window.location.href);
      setShowConfirm(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirm(false);

    try {
      const result = await submitExam({
        examId: exam.id,
        answers,
        timeSpent: totalSeconds - Math.max(0, timeLeft)
      });

      if (result.success) {
        toast.success('Nộp bài thành công!');
        window.location.href = '/student/profile'; // Redirect
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi nộp bài');
        setIsSubmitting(false);
      }
    } catch (e) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const parseOptions = (options: any) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== "").length;
  const progressPercent = questions?.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-24 font-sans relative">
      <div className="max-w-[1000px] mx-auto pt-8 px-4">

        {/* Exam Header Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
              <p className="text-gray-500 font-medium">Mô tả: {exam.description || exam.level}</p>
            </div>

            <div className="shrink-0">
              <div className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl flex flex-col items-center min-w-[140px]">
                <span className="text-xs font-bold uppercase tracking-wider mb-1 text-red-400">Thời gian còn lại</span>
                <div className="flex items-center gap-2 font-mono text-2xl font-bold">
                  <Clock size={24} className="text-red-500" />
                  {formatTime(Math.max(0, timeLeft))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <div className="font-bold text-gray-700">Tiến độ làm bài</div>
              <div className="font-bold text-[#ea580c]">{answeredCount}/{questions?.length || 0} câu</div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ea580c] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions?.map((q: any, i: number) => {
            // q is the unwrapped object from Admin (ExamQuestionSchema)
            // It uses q.question_type ("reading_mcq", "reading_open", etc.), and q.question, q.passage
            
            // Support backward compatibility if it's an old scheme
            const type = q.question_type || q.type;
            const content = q.question || q.content || '';
            const passage = q.passage || '';
            
            // For MCQs, Admin saves options array directly in q.options
            const parsedArrayOpts = parseOptions(q.options);
            
            return (
              <div key={q.id || i} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Question Number */}
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-[#ea580c] text-lg">
                    {i + 1}
                  </div>
                  
                  {/* Question Content */}
                  <div className="flex-1 pt-1">
                    {passage && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: passage }} />
                    )}
                    
                    <div className="font-bold text-gray-800 text-lg mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />

                    {/* Multiple Choice (supports reading_mcq, listening_mcq, multiple_choice) */}
                    {(type === 'multiple_choice' || type === 'reading_mcq' || type === 'listening_mcq') && parsedArrayOpts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedArrayOpts.map((opt: string, optIdx: number) => {
                          const isChecked = answers[q.id] === opt;
                          return (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-[#ea580c] bg-orange-50/50' 
                                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isChecked ? 'border-[#ea580c]' : 'border-gray-300'
                              }`}>
                                {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></div>}
                              </div>
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={opt}
                                checked={isChecked}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                className="hidden"
                              />
                              <span className={`leading-relaxed ${isChecked ? 'text-[#ea580c] font-medium' : 'text-gray-700'}`}>
                                {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Word Arrangement / Error Correction / Fill Blank */}
                    {(type === 'word_arrangement' || type === 'error_correction' || type === 'listening_fill') && (
                       <div className="mt-4">
                         <input
                           type="text"
                           className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#ea580c] focus:ring-4 focus:ring-orange-50/50 outline-none text-gray-800 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
                           placeholder="Nhập câu trả lời..."
                           value={answers[q.id] || ''}
                           onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                         />
                       </div>
                    )}

                    {/* Open Ended / Essay (supports reading_open, listening_open, essay, fill_in_blank) */}
                    {(type === 'fill_in_blank' || type === 'essay' || type === 'reading_open' || type === 'listening_open') && (
                      <div className="mt-4">
                        <textarea
                          className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#ea580c] focus:ring-4 focus:ring-orange-50/50 outline-none resize-y min-h-[120px] text-gray-800 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
                          placeholder="Chưa trả lời..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Area */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="bg-[#ea580c] text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3"
          >
            <Send size={24} className={isSubmitting ? "animate-bounce" : ""} />
            {isSubmitting ? 'Đang xử lý...' : 'NỘP BÀI'}
          </button>
          <p className="text-gray-500 mt-4 font-medium">Hãy kiểm tra kỹ các câu trả lời trước khi nộp.</p>
        </div>

      </div>

      {/* Confirm Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-orange-50 text-[#ea580c] rounded-full flex items-center justify-center mb-6 mx-auto">
              <HelpCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">Xác nhận nộp bài?</h3>
            <div className="text-gray-600 text-center mb-8 font-medium">
              Bạn có chắc chắn muốn nộp bài kiểm tra này?
              {answeredCount < (questions?.length || 0) && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2 text-left">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>Bạn vẫn còn <b>{(questions?.length || 0) - answeredCount} câu</b> chưa trả lời. Hãy cân nhắc kỹ trước khi nộp!</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-3.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Quay lại làm bài
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="py-3.5 font-bold text-white bg-[#ea580c] hover:bg-orange-600 shadow-md shadow-orange-500/20 rounded-xl transition flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Đang nộp...</span>
                  </>
                ) : (
                  <span>Nộp bài ngay</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full screen loader when submitting */}
      {isSubmitting && !showConfirm && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#ea580c] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="animate-spin relative text-[#ea580c]" size={64} />
          </div>
          <p className="font-bold text-gray-900 text-2xl mb-2">Đang chấm điểm...</p>
          <p className="text-gray-500 font-medium">Hệ thống AI đang xử lý bài làm của bạn.</p>
        </div>
      )}
    </div>
  );
}
