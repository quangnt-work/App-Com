// src/components/student/exams/attempt/ExamAttemptClient.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, HelpCircle, AlertCircle, Loader2, Send, CheckCircle2, XCircle, Trophy, BookOpen, RotateCcw } from 'lucide-react';
import { submitExam } from '@/actions/examSubmissions';
import { toast } from 'sonner';

type ExamResult = {
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  passed: boolean;
};

export function ExamAttemptClient({ exam, questions, user }: any) {
  const router = useRouter();
  const isExamDoneRef = useRef(false); // Track if exam has been submitted

  const totalSeconds = (exam.duration || 60) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Prevent accidental navigation - disabled once exam is submitted
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (isExamDoneRef.current) return; // Exam done, allow navigation
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowConfirm(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExamDoneRef.current) return; // Exam done, don't block navigation
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

    toast.loading('Đang nộp bài và chấm điểm bằng AI...', { id: 'submit-toast', duration: 60000 });

    try {
      const result = await submitExam({
        examId: exam.id,
        answers,
        timeSpent: totalSeconds - Math.max(0, timeLeft)
      });

      toast.dismiss('submit-toast');

      if (result.success) {
        isExamDoneRef.current = true; // Disable navigation guards
        toast.success('AI đã chấm xong bài của bạn!');
        setExamResult({
          score: result.score ?? 0,
          totalQuestions: result.totalQuestions ?? questions?.length ?? 0,
          correctCount: result.correctCount ?? 0,
          wrongCount: result.wrongCount ?? 0,
          passed: result.passed ?? false,
        });
        setIsSubmitting(false);
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi nộp bài');
        setIsSubmitting(false);
      }
    } catch (e) {
      toast.dismiss('submit-toast');
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

  const isAnswerFilled = (val: string) => {
     if (!val) return false;
     try {
       const parsed = JSON.parse(val);
       if (Array.isArray(parsed)) {
          if (parsed.length === 0) return false;
          // check if it's error correction array [{wrong: '', correct: ''}]
          if (typeof parsed[0] === 'object' && parsed[0] !== null) {
             return parsed.some((p: any) => p.wrong?.trim() || p.correct?.trim());
          }
          return true; // Array of indexes or strings > 0
       }
       return true;
     } catch {
       return val.trim() !== "";
     }
  };

  const answeredCount = Object.keys(answers).filter(k => isAnswerFilled(answers[k])).length;
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
            
            let content = q.question || '';
            // If no explicit question but we have q.content, check if it's a JSON string
            if (!content && typeof q.content === 'string') {
              try {
                JSON.parse(q.content);
                // It's JSON from DB fallback, ignore it so it doesn't display on screen
              } catch (e) {
                content = q.content; // Normal legacy text
              }
            }

            // Build custom content for specific structured types that don't use 'question' field
            if (type === 'listening_fill') {
               content = q.transcript_template || content;
            } else if (type === 'word_arrangement') {
               const contextText = q.context ? `<p class="mb-2 text-gray-700">${q.context}</p>` : `<p class="mb-2 text-gray-700">Sắp xếp các gợi ý sau thành câu hoàn chỉnh:</p>`;
               const wordsHtml = Array.isArray(q.words) ? `<div class="mt-4 p-4 bg-orange-50/50 border border-orange-100 rounded-xl text-left font-medium text-lg text-orange-800 tracking-widest shadow-inner">${q.words.join(' &nbsp;|&nbsp; ')}</div>` : '';
               content = contextText + wordsHtml;
            } else if (type === 'error_correction') {
               const sentenceHtml = q.sentence ? `<div class="mt-4 text-xl text-center font-medium p-4 bg-gray-50 text-gray-800 rounded-xl leading-relaxed border border-gray-200">"${q.sentence}"</div>` : '';
               content = `<p class="mb-2 text-gray-700">Tìm và sửa lỗi sai trong câu sau:</p>` + sentenceHtml;
            }

            const passage = q.passage || '';
            const audioUrl = q.audio_url || q.media_url || '';
            
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
                    {audioUrl && (
                      <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-center shadow-sm">
                        <audio controls className="w-full outline-none" controlsList="nodownload">
                          <source src={audioUrl} />
                          Trình duyệt của bạn không hỗ trợ thẻ audio.
                        </audio>
                      </div>
                    )}
                    
                    {passage && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: passage }} />
                    )}
                    
                    {content && (
                      <div className="font-bold text-gray-800 text-lg mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                    )}

                    {/* Multiple Choice (supports reading_mcq, listening_mcq, multiple_choice) */}
                    {(type === 'multiple_choice' || type === 'reading_mcq' || type === 'listening_mcq') && parsedArrayOpts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedArrayOpts.map((opt: string, optIdx: number) => {
                          const isMulti = q.selection_mode === 'multi';
                          
                          let currentSelection: number[] = [];
                          if (answers[q.id]) {
                             try {
                               const parsed = JSON.parse(answers[q.id]);
                               if (Array.isArray(parsed)) {
                                  // if it's an array of strings (legacy attempt state?), convert to numeric index
                                  currentSelection = parsed.map(v => typeof v === 'number' ? v : parsedArrayOpts.indexOf(v));
                               }
                             } catch {
                               currentSelection = [parsedArrayOpts.indexOf(answers[q.id])];
                             }
                          }
                          
                          const isChecked = currentSelection.includes(optIdx);

                          return (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-[#ea580c] bg-orange-50/50' 
                                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`shrink-0 w-5 h-5 border-2 flex items-center justify-center ${
                                isChecked ? 'border-[#ea580c] bg-[#ea580c]' : 'border-gray-300 bg-white'
                              } ${!isMulti ? 'rounded-full' : 'rounded-md'}`}>
                                {isChecked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                              </div>
                              <input
                                type={isMulti ? "checkbox" : "radio"}
                                name={`q-${q.id}`}
                                value={optIdx}
                                checked={isChecked}
                                onChange={(e) => {
                                  if (isMulti) {
                                    if (e.target.checked) handleAnswerChange(q.id, JSON.stringify([...currentSelection, optIdx]));
                                    else handleAnswerChange(q.id, JSON.stringify(currentSelection.filter(i => i !== optIdx)));
                                  } else {
                                    handleAnswerChange(q.id, JSON.stringify([optIdx]));
                                  }
                                }}
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

                    {/* Word Arrangement / Fill Blank */}
                    {(type === 'word_arrangement' || type === 'listening_fill') && (
                       <div className="mt-4">
                         {type === 'listening_fill' && (
                            <p className="text-sm text-gray-500 mb-3 italic">* Nếu câu hỏi có nhiều chỗ trống, vui lòng nhập theo thứ tự cách nhau bởi dấu phẩy.</p>
                         )}
                         <input
                           type="text"
                           className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#ea580c] focus:ring-4 focus:ring-orange-50/50 outline-none text-gray-800 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
                           placeholder="Nhập câu trả lời..."
                           value={answers[q.id] || ''}
                           onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                         />
                       </div>
                    )}

                    {/* Error Correction Special Input */}
                    {type === 'error_correction' && (
                      <div className="mt-4">
                         <p className="text-sm text-gray-500 mb-3 italic">* Vui lòng chỉ ra phần sai và cách sửa lại đúng.</p>
                         <div className="flex flex-col gap-4">
                           {(() => {
                             let pairs: {wrong: string, correct: string}[] = [];
                             try {
                               pairs = JSON.parse(answers[q.id]);
                               if (!Array.isArray(pairs)) throw new Error('not array');
                             } catch(e) {
                               const parts = (answers[q.id] || '').split('||');
                               pairs = [{"wrong": parts[0] || "", "correct": parts[1] || ""}];
                             }
                             
                             return (
                               <>
                                 {pairs.map((pair, idx) => (
                                   <div key={idx} className="flex flex-col md:flex-row gap-4 items-center relative bg-white p-2 rounded-2xl border border-gray-50 shadow-sm group">
                                     <input
                                       type="text"
                                       className="w-full p-4 border-2 border-red-100 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-50/50 outline-none text-red-800 transition-all font-medium placeholder:text-red-400 placeholder:font-normal bg-red-50/20"
                                       placeholder="Từ/cụm từ sai..."
                                       value={pair.wrong}
                                       onChange={(e) => {
                                         const newPairs = [...pairs];
                                         newPairs[idx].wrong = e.target.value;
                                         handleAnswerChange(q.id, JSON.stringify(newPairs));
                                       }}
                                     />
                                     <div className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-gray-100 items-center justify-center text-gray-400">
                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                     </div>
                                     <input
                                       type="text"
                                       className="w-full p-4 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50/50 outline-none text-green-800 transition-all font-medium placeholder:text-green-400 placeholder:font-normal bg-green-50/20"
                                       placeholder="Sửa lại thành..."
                                       value={pair.correct}
                                       onChange={(e) => {
                                         const newPairs = [...pairs];
                                         newPairs[idx].correct = e.target.value;
                                         handleAnswerChange(q.id, JSON.stringify(newPairs));
                                       }}
                                     />
                                     
                                     {pairs.length > 1 && (
                                       <button 
                                         onClick={() => {
                                           const newPairs = pairs.filter((_, i) => i !== idx);
                                           handleAnswerChange(q.id, JSON.stringify(newPairs));
                                         }}
                                         className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl md:static absolute right-0 top-0 transition-colors"
                                         title="Xóa nhóm này"
                                       >
                                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                       </button>
                                     )}
                                   </div>
                                 ))}
                                 
                                 <button 
                                   onClick={() => {
                                     const newPairs = [...pairs, {"wrong": "", "correct": ""}];
                                     handleAnswerChange(q.id, JSON.stringify(newPairs));
                                   }}
                                   className="self-start flex items-center gap-2 mt-2 px-5 py-3 text-sm font-bold text-[#ea580c] bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-100 shadow-sm"
                                 >
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                                   Thêm cụm từ lỗi khác
                                 </button>
                               </>
                             );
                           })()}
                         </div>
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

      {/* Exam Results Popup */}
      {examResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className={`p-8 flex flex-col items-center text-center ${
              examResult.passed 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100' 
                : 'bg-gradient-to-br from-red-50 to-orange-100'
            }`}>
              {examResult.passed ? (
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/40">
                  <Trophy size={44} className="text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-red-400 flex items-center justify-center mb-4 shadow-lg shadow-red-400/40">
                  <BookOpen size={44} className="text-white" />
                </div>
              )}
              <div className={`text-6xl font-black mb-1 ${
                examResult.passed ? 'text-green-600' : 'text-red-500'
              }`}>
                {examResult.score.toFixed(1)}<span className="text-3xl font-bold opacity-60">/10</span>
              </div>
              <span className={`text-lg font-bold px-6 py-2 rounded-full mt-2 ${
                examResult.passed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-400 text-white'
              }`}>
                {examResult.passed ? '🎉 ĐẠT' : '❌ CHƯA ĐẠT'}
              </span>
            </div>

            {/* Body */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">{exam.title}</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                Cấp độ: {exam.level} &bull; Thời gian: {exam.duration} phút
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-2xl font-black text-gray-800">{examResult.totalQuestions}</span>
                  <span className="text-xs text-gray-500 font-semibold mt-1 text-center">Tổng câu hỏi</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-2xl">
                  <span className="text-2xl font-black text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={22} className="inline" />{examResult.correctCount}
                  </span>
                  <span className="text-xs text-green-600 font-semibold mt-1 text-center">Câu đúng</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-50 rounded-2xl">
                  <span className="text-2xl font-black text-red-400 flex items-center gap-1">
                    <XCircle size={22} className="inline" />{examResult.wrongCount}
                  </span>
                  <span className="text-xs text-red-400 font-semibold mt-1 text-center">Câu sai/bỏ</span>
                </div>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    examResult.passed ? 'bg-green-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${(examResult.score / 10) * 100}%` }}
                />
              </div>

              <p className="text-center text-sm text-gray-500 mb-6">
                {examResult.passed
                  ? 'Xuất sắc! Bạn đã vượt qua bài kiểm tra này. Hãy tiếp tục phát huy!'
                  : 'Bạn chưa đạt yêu cầu tối thiểu 70%. Hãy ôn luyện thêm và thử lại nhé!'}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.replace('/student/exams')}
                  className="flex items-center justify-center gap-2 py-3.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  <RotateCcw size={18} />
                  Làm bài khác
                </button>
                <button
                  onClick={() => window.location.replace('/student/profile')}
                  className="flex items-center justify-center gap-2 py-3.5 font-bold text-white bg-[#ea580c] hover:bg-orange-600 rounded-xl transition shadow-lg shadow-orange-500/20"
                >
                  <Trophy size={18} />
                  Xem thành tích
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
