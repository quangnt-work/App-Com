"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExam } from "@/actions/ExamActions";

interface ExamDeleteButtonProps {
  id: string;
  title: string;
}

export default function ExamDeleteButton({ id, title }: ExamDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteExam(id);
      setConfirmOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Confirm Dialog */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 whitespace-normal break-words text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Bạn có chắc muốn xóa đề thi{" "}
              <span className="font-semibold text-gray-700">"{title}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <Button
                variant="outline"
                className="rounded-lg font-medium"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
