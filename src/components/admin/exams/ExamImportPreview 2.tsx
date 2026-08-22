// src/components/admin/exams/ExamImportPreview.tsx
"use client";

import { CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParsedQuestion, ImportStats } from "@/lib/examImportParser";

interface ExamImportPreviewProps {
  questions: ParsedQuestion[];
  stats: ImportStats;
  onRemoveQuestion: (index: number) => void;
}

export default function ExamImportPreview({
  questions,
  stats,
  onRemoveQuestion,
}: ExamImportPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</p>
          <p className="text-xs text-blue-500 mt-1">Câu hỏi</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.matchedCount}</p>
          <p className="text-xs text-green-500 mt-1">Đã có đáp án</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.totalAnswers}</p>
          <p className="text-xs text-purple-500 mt-1">Đáp án trong file</p>
        </div>
        {stats.unmatchedQuestions.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {stats.unmatchedQuestions.length}
            </p>
            <p className="text-xs text-amber-500 mt-1">Chưa có đáp án</p>
          </div>
        )}
      </div>

      {/* Warning for unmatched */}
      {stats.unmatchedQuestions.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Một số câu chưa có đáp án:</p>
            <p className="text-amber-600 mt-1">
              Câu #{stats.unmatchedQuestions.slice(0, 20).join(", ")}
              {stats.unmatchedQuestions.length > 20 && ` và ${stats.unmatchedQuestions.length - 20} câu khác`}
            </p>
            <p className="text-amber-500 mt-1 text-xs">
              Các câu này sẽ bị bỏ qua khi lưu đề thi (cần có đáp án đúng để chấm tự động).
            </p>
          </div>
        </div>
      )}

      {/* Questions Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-12">STT</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Câu hỏi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-48">Đáp án</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 w-24">Đ/A đúng</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {questions.map((q, i) => {
                const hasAnswer = q.correctIndex !== undefined;
                return (
                  <tr
                    key={`${q.number}-${i}`}
                    className={
                      hasAnswer
                        ? "hover:bg-gray-50/50"
                        : "bg-amber-50/50 hover:bg-amber-50"
                    }
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {q.number}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-[300px]">
                      <p className="truncate" title={q.question}>
                        {q.question}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {q.options.map((opt, oi) => (
                          <span
                            key={oi}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                              q.correctIndex === oi
                                ? "bg-green-100 text-green-700 font-medium ring-1 ring-green-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            title={opt}
                          >
                            <span className="font-semibold">{q.optionLabels[oi] || String.fromCharCode(65 + oi)}.</span>
                            <span className="truncate max-w-[60px]">{opt}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasAnswer ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {q.optionLabels[q.correctIndex!] || String.fromCharCode(65 + q.correctIndex!)}
                        </span>
                      ) : (
                        <span className="text-amber-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onRemoveQuestion(i)}
                        className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
