// src/components/admin/exams/ExamPreviewModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Clock, CalendarDays } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Exam } from "@/types/database-custom";
import { EXAM_LEVEL_LABELS, EXAM_TYPE_LABELS, ExamQuestion } from "@/lib/schemas/exam";
import { ExamPreviewQuestions } from "./ExamPreviewQuestions";
import { getExamQuestions } from "@/actions/ExamActions";
import { useState, useEffect } from "react";
import { Loader2, Layers, AlignLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
}

const safeFormatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date =
    typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
  return isValid(date) ? format(date, "dd/MM/yyyy", { locale: vi }) : "-";
};

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return "Chưa cập nhật";
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
};

export function ExamPreviewModal({
  isOpen,
  onClose,
  exam,
}: ExamPreviewModalProps) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && exam?.id) {
      setIsLoading(true);
      getExamQuestions(exam.id)
        .then((res) => {
          if (!res.error) setQuestions(res.data as ExamQuestion[]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setQuestions([]);
    }
  }, [isOpen, exam]);

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[92vh] h-full w-full flex flex-col p-0 gap-0 overflow-hidden bg-slate-50 sm:rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 shrink-0 bg-white border-b border-gray-100 shadow-sm z-10 relative flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="text-[#f97316] border-orange-200 bg-orange-50 font-semibold tracking-wide"
              >
                Xem trước Đề thi
              </Badge>
              {exam.status === "published" ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Đã xuất bản</Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Bản nháp</Badge>
              )}
            </div>
            <DialogTitle className="text-2xl font-bold leading-snug">{exam.title}</DialogTitle>
          </div>
          <Button
             variant="ghost"
             size="icon"
             className="text-gray-400 hover:text-gray-700"
             onClick={onClose}
             aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <Separator className="shrink-0" />

        {/* Body */}
        <div className="flex-1 w-full overflow-y-auto relative bg-slate-50">
          <div className="p-6 md:p-8 space-y-8 max-w-[1000px] mx-auto">
            {/* Cảnh báo người dùng nếu đề có mô tả */}
            {exam.description && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="text-sm font-medium text-blue-800 flex items-start gap-2">
                  <AlignLeft className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                  <span className="whitespace-pre-wrap leading-relaxed">{exam.description}</span>
                </p>
              </div>
            )}

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Loại đề thi */}
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-blue-500" /> Loại đề thi
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {EXAM_TYPE_LABELS[exam.exam_type] || "Tổng hợp"}
                </p>
              </div>

              {/* Cấp độ */}
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-purple-500" /> Cấp độ
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {EXAM_LEVEL_LABELS[exam.level] || "Mọi cấp độ"}
                </p>
              </div>

              {/* Thời gian */}
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-[#f97316]" /> Thời gian
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatDuration(exam.duration)}
                </p>
              </div>

              {/* Số lượng câu */}
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlignLeft size={14} className="text-emerald-500" /> Tổng số câu
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {isLoading ? "..." : (
                    `${questions.length > 0
                      ? questions.reduce((total, q: any) => {
                          if (q.question_type === 'reading_group' || q.question_type === 'listening_group') {
                            return total + (q.sub_questions?.length || 0);
                          }
                          return total + 1;
                        }, 0)
                      : exam.question_count || 0} câu`
                  )}
                </p>
              </div>
            </div>

            {/* Questions Loading / Render */}
            <div className="pt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center justify-between">
                <span>Nội dung bài thi</span>
                {isLoading && <Loader2 size={16} className="text-gray-400 animate-spin" />}
              </h3>
              
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={32} className="text-orange-500 animate-spin" />
                  <p className="text-sm font-medium text-gray-500 animate-pulse">Đang tải chi tiết các câu hỏi...</p>
                </div>
              ) : (
                <ExamPreviewQuestions questions={questions} />
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 flex justify-end">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
