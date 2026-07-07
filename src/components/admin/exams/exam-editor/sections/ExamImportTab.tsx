// src/components/admin/exams/exam-editor/sections/ExamImportTab.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { importExamFromFiles, type ImportParseResult } from "@/actions/ExamImportActions";
import type { ParsedQuestion, ImportStats } from "@/lib/examImportParser";
import ExamImportPreview from "../../ExamImportPreview";

type Step = "upload" | "processing" | "preview";

interface ExamImportTabProps {
  onImportSuccess: (questions: ParsedQuestion[]) => void;
}

export default function ExamImportTab({ onImportSuccess }: ExamImportTabProps) {
  const [step, setStep] = useState<Step>("upload");

  // Upload state
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const qInputRef = useRef<HTMLInputElement>(null);
  const aInputRef = useRef<HTMLInputElement>(null);

  // Processing state
  const [processingStatus, setProcessingStatus] = useState("");

  // Preview state
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);

  const resetState = useCallback(() => {
    setStep("upload");
    setQuestionFile(null);
    setAnswerFile(null);
    setProcessingStatus("");
    setQuestions([]);
    setStats(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, target: "question" | "answer") => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        if (target === "question") setQuestionFile(file);
        else setAnswerFile(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleProcess = async () => {
    if (!questionFile) {
      toast.error("Vui lòng chọn file câu hỏi.");
      return;
    }

    setStep("processing");
    setProcessingStatus("Đang đọc và phân tích file...");

    try {
      const formData = new FormData();
      formData.append("questionFile", questionFile);
      if (answerFile) formData.append("answerFile", answerFile);

      const result = await importExamFromFiles(formData);

      if (!result.success) {
        toast.error(result.error);
        setStep("upload");
        return;
      }

      // Success
      const data = result as ImportParseResult;
      setQuestions(data.questions);
      setStats(data.stats);
      setStep("preview");
    } catch {
      toast.error("Lỗi khi phân tích file. Vui lòng thử lại.");
      setStep("upload");
    }
  };

  const handleRemoveQuestion = useCallback(
    (index: number) => {
      setQuestions((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      });
      // Update stats
      setStats((prev) => {
        if (!prev) return prev;
        const removed = questions[index];
        const hadAnswer = removed?.correctIndex !== undefined;
        return {
          ...prev,
          totalQuestions: prev.totalQuestions - 1,
          matchedCount: hadAnswer ? prev.matchedCount - 1 : prev.matchedCount,
          unmatchedQuestions: hadAnswer
            ? prev.unmatchedQuestions
            : prev.unmatchedQuestions.filter((n) => n !== removed?.number),
        };
      });
    },
    [questions]
  );

  const handleConfirmImport = () => {
    const validQuestions = questions.filter(
      (q) => q.correctIndex !== undefined && q.options.length >= 2
    );
    // Even if answers are optional in file, multiple choice usually needs a correct answer for the DB
    // However, if the user didn't upload answer file, maybe they want to add them manually in the UI
    const questionsToImport = questions.filter((q) => q.options.length >= 2);
    
    if (questionsToImport.length === 0) {
      toast.error("Không có câu hỏi hợp lệ nào để import.");
      return;
    }

    onImportSuccess(questionsToImport);
    resetState();
  };

  const FileDropZone = ({
    label,
    file,
    onFileChange,
    inputRef,
    target,
    required,
    accept,
  }: {
    label: string;
    file: File | null;
    onFileChange: (f: File | null) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    target: "question" | "answer";
    required?: boolean;
    accept?: string;
  }) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-5 transition-all cursor-pointer
        ${file ? "border-green-300 bg-green-50/50" : "border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30"}`}
      onClick={() => inputRef.current?.click()}
      onDrop={(e) => handleDrop(e, target)}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept || ".docx,.txt"}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          onFileChange(f);
        }}
      />
      <div className="flex items-center gap-3">
        {file ? (
          <div className="p-2 rounded-lg bg-green-100">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-gray-100">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-400">*</span>}
          </p>
          {file ? (
            <p className="text-xs text-green-600 truncate mt-0.5">
              {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">
              Kéo thả hoặc click để chọn file .docx / .txt
            </p>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      {step === "upload" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tải lên file câu hỏi để tự động phân tích. Nếu có file đáp án (tùy chọn), hãy tải lên để hệ thống tự động đánh dấu đáp án đúng.
          </p>

          <FileDropZone
            label="File câu hỏi"
            file={questionFile}
            onFileChange={setQuestionFile}
            inputRef={qInputRef}
            target="question"
            required
          />

          <FileDropZone
            label="File đáp án (Tùy chọn)"
            file={answerFile}
            onFileChange={setAnswerFile}
            inputRef={aInputRef}
            target="answer"
            required={false}
          />

          <Button
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white h-11"
            disabled={!questionFile}
            onClick={handleProcess}
            type="button"
          >
            <Upload className="w-4 h-4" />
            Phân tích file
          </Button>
        </div>
      )}

      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500">{processingStatus}</p>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full animate-pulse w-2/3"></div>
          </div>
        </div>
      )}

      {step === "preview" && stats && (
        <div className="space-y-5">
          <ExamImportPreview
            questions={questions}
            stats={stats}
            onRemoveQuestion={handleRemoveQuestion}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setStep("upload");
                setQuestions([]);
                setStats(null);
              }}
            >
              ← Tải lại file khác
            </Button>
            <Button
              type="button"
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
              onClick={handleConfirmImport}
            >
              <CheckCircle2 className="w-4 h-4" />
              Chèn vào đề thi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
