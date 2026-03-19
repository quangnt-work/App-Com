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
            {/* Audio */}
            {"audio_url" in q && q.audio_url && (
              <div className="w-full max-w-sm mb-4">
                <audio controls src={q.audio_url} className="w-full h-10" />
              </div>
            )}

            {/* Đoạn văn */}
            {"passage" in q && q.passage && (
              <div className="p-4 bg-gray-50 rounded-[10px] border border-gray-100 text-gray-700 text-sm font-medium whitespace-pre-wrap leading-relaxed">
                {q.passage}
              </div>
            )}

            {/* Câu hỏi */}
            {"question" in q && q.question && (
              <p className="font-semibold text-gray-800 text-base">{q.question}</p>
            )}

            {/* Câu bị lỗi (Error Correction) */}
            {"sentence" in q && q.sentence && (
              <p className="font-semibold text-gray-800 text-base">{q.sentence}</p>
            )}

            {/* Trắc nghiệm (MCQ) */}
            {"options" in q && Array.isArray(q.options) && (
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
            {"sample_answer" in q && q.sample_answer && (
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
            {"explanation" in q && q.explanation && (
              <div className="mt-5 p-3.5 bg-blue-50 border border-blue-100 rounded-[10px]">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                  Giải thích đáp án
                </p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
