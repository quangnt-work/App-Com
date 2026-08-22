"use client";

import { ExamQuestion, QUESTION_TYPE_LABELS } from "@/lib/schemas/exam";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Square, Circle, CheckSquare2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  questions: ExamQuestion[];
}

export function ExamPreviewQuestions({ questions }: Props) {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
        <p className="text-gray-500 font-medium">Đề thi này chưa có câu hỏi nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f97316]"></div>

          <div className="flex items-center gap-3 mb-5">
            <span className="font-bold text-gray-900 text-lg">Câu {idx + 1}</span>
            <Badge
              variant="outline"
              className="text-xs bg-orange-50 text-orange-600 border-orange-200 px-2 py-0.5"
            >
              {QUESTION_TYPE_LABELS[q.question_type] || q.question_type}
            </Badge>
          </div>

          <div className="space-y-4 pl-1">
            {/* Hướng dẫn / Mô tả */}
            {"instruction" in q && q.instruction && (
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-blue-800 text-sm font-medium">
                {q.instruction as React.ReactNode}
              </div>
            )}

            {/* Audio */}
            {["listening_group", "listening_mcq", "listening_open", "listening_fill"].includes(q.question_type) && "audio_url" in q && q.audio_url && (
              <div className="w-full max-w-sm mb-4">
                <audio controls src={q.audio_url} className="w-full h-10" />
              </div>
            )}

            {/* Đoạn văn */}
            {["reading_group", "reading_mcq", "reading_open"].includes(q.question_type) && "passage" in q && q.passage && (
              <div 
                className="p-4 bg-gray-50 rounded-[10px] border border-gray-100 text-gray-700 text-sm font-medium whitespace-pre-wrap leading-relaxed [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>p]:mb-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline"
                dangerouslySetInnerHTML={{ __html: q.passage as string }}
              />
            )}

            {/* Câu hỏi */}
            {["reading_mcq", "reading_open", "listening_mcq", "listening_open"].includes(q.question_type) && "question" in q && q.question && (
              <p className="font-semibold text-gray-800 text-base">{q.question}</p>
            )}

            {/* Câu bị lỗi (Error Correction) */}
            {q.question_type === "error_correction" && "sentence" in q && q.sentence && (
              <p className="font-semibold text-gray-800 text-base">{q.sentence}</p>
            )}

            {/* Trắc nghiệm (MCQ) */}
            {["reading_mcq", "listening_mcq"].includes(q.question_type) && "options" in q && Array.isArray(q.options) && (
              <div className="space-y-2 mt-4">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correct_indexes?.includes(optIdx);
                  const isMulti = "selection_mode" in q && q.selection_mode === "multi";
                  return (
                    <div
                      key={optIdx}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                        isCorrect
                          ? "border-green-300 bg-green-50/70"
                          : "border-gray-100 bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "shrink-0",
                          isCorrect ? "text-green-500" : "text-gray-300"
                        )}
                      >
                        {isMulti ? (
                          isCorrect ? <CheckSquare2 size={18} /> : <Square size={18} />
                        ) : isCorrect ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Circle size={18} />
                        )}
                      </div>
                      <span className="font-medium text-sm text-gray-500 w-5 font-mono">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span
                        className={cn(
                          "text-sm flex-1 leading-tight",
                          isCorrect ? "text-green-800 font-medium" : "text-gray-700"
                        )}
                      >
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Đáp án mẫu (Open ended) */}
            {["reading_open", "listening_open"].includes(q.question_type) && "sample_answer" in q && q.sample_answer && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1.5">
                  Đáp án mẫu:
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded-[10px] text-sm text-green-700 font-medium whitespace-pre-wrap">
                  {q.sample_answer}
                </div>
              </div>
            )}

            {/* Điền từ (Listening fill blank) */}
            {q.question_type === "listening_fill" && (
              <div className="mt-4 space-y-4">
                <div className="text-gray-800 font-medium whitespace-pre-wrap leading-loose p-4 bg-gray-50 border border-gray-100 rounded-[10px]">
                  {q.transcript_template}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Các từ cần điền:
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {q.correct_answers.map((ans, aIdx) => (
                      <div
                        key={aIdx}
                        className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-sm text-green-700"
                      >
                        <span className="font-bold text-green-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-90 shadow-sm">
                          {aIdx + 1}
                        </span>
                        {ans}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sắp xếp từ (Word arrangement) */}
            {q.question_type === "word_arrangement" && (
              <div className="mt-4 space-y-4">
                {q.context && (
                  <p className="text-sm text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    Ngữ cảnh: {q.context}
                  </p>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Các từ để sắp xếp:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.words.map((w, wIdx) => (
                      <Badge
                        key={wIdx}
                        variant="secondary"
                        className="px-3 py-1.5 text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1.5">
                    Câu hoàn chỉnh:
                  </div>
                  <div className="p-3 bg-green-50 border border-green-100 rounded-[10px] text-sm text-green-700 font-medium">
                    {q.correct_sentence}
                  </div>
                </div>
              </div>
            )}

            {/* Chữa lỗi sai */}
            {q.question_type === "error_correction" && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 p-3 bg-red-50 border border-red-100 rounded-[10px]">
                    <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                      Phần sai
                    </span>
                    <span className="text-sm font-medium text-red-700">
                      {q.wrong_part}
                    </span>
                  </div>
                  <div className="flex-1 p-3 bg-green-50 border border-green-100 rounded-[10px]">
                    <span className="text-[11px] font-bold text-green-500 uppercase tracking-wider block mb-1">
                      Sửa thành
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      {q.correct_part}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Giải thích (Explanation) */}
            {["reading_mcq", "listening_mcq", "word_arrangement", "error_correction"].includes(q.question_type) && "explanation" in q && q.explanation && (
              <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-[10px]">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                  Giải thích đáp án
                </p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Câu hỏi con (Nhóm bài Đọc/Nghe hiểu) */}
            {["reading_group", "listening_group"].includes(q.question_type) && "sub_questions" in q && Array.isArray(q.sub_questions) && q.sub_questions.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Các câu hỏi con:</h4>
                {q.sub_questions.map((subQ, subIdx) => {
                  const isMulti = subQ.selection_mode === "multi";
                  return (
                    <div key={subIdx} className="bg-gray-50/80 p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                      <div className="flex items-start gap-3 mb-4">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {subIdx + 1}
                        </span>
                        <p className="font-semibold text-gray-800 text-base flex-1 pt-0.5">{subQ.question}</p>
                      </div>
                      
                      <div className="space-y-2.5 pl-9">
                        {subQ.options.map((opt: string, optIdx: number) => {
                          const isCorrect = subQ.correct_indexes?.includes(optIdx);
                          return (
                            <div
                              key={optIdx}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                                isCorrect
                                  ? "border-green-300 bg-green-50 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "shrink-0 transition-colors",
                                  isCorrect ? "text-green-500" : "text-gray-300"
                                )}
                              >
                                {isMulti ? (
                                  isCorrect ? <CheckSquare2 size={18} /> : <Square size={18} />
                                ) : isCorrect ? (
                                  <CheckCircle2 size={18} />
                                ) : (
                                  <Circle size={18} />
                                )}
                              </div>
                              <span className="font-medium text-[13px] text-gray-400 w-5 font-mono">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span
                                className={cn(
                                  "text-sm flex-1 leading-snug",
                                  isCorrect ? "text-green-800 font-medium" : "text-gray-700"
                                )}
                              >
                                {opt}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {subQ.explanation && (
                        <div className="mt-4 ml-9 p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl relative">
                          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            Giải thích
                          </p>
                          <p className="text-[13px] text-blue-900 leading-relaxed font-medium">
                            {subQ.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
