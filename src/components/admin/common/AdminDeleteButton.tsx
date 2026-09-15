// src/components/admin/common/AdminDeleteButton.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { toast } from "sonner";

export interface AdminDeleteButtonProps {
  id: string;
  title: string;
  itemTypeLabel: string; // e.g. "bài học", "bài nghe", "video", "đề thi"
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export function AdminDeleteButton({
  id,
  title,
  itemTypeLabel,
  onDelete,
}: AdminDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await onDelete(id);
        if (res.success) {
          toast.success(res.message || `Đã xóa ${itemTypeLabel} thành công!`);
          setOpen(false);
        } else {
          toast.error(res.message || `Không thể xóa ${itemTypeLabel}.`);
        }
      } catch (e: unknown) {
        const error = e as Error;
        toast.error(error.message || `Đã xảy ra lỗi khi xóa ${itemTypeLabel}.`);
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xóa ${itemTypeLabel}`}
        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isPending}
        title={`Xóa ${itemTypeLabel}?`}
        description={`Bạn có chắc muốn xóa "${title}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
}

export default AdminDeleteButton;
