"use client";




import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteLesson } from "@/actions/lesson-actions";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";




export default function DeleteLessonButton({ id, title }: { id: string, title: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();




  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteLesson(id);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };




  return (
    <>
      <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
      onClick={() => setOpen(true)}
      disabled={isPending}
    >
      <Trash2 className="w-4 h-4" />
      </Button>
     
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isPending}
        title="Xóa bài học?"
        description={`Bạn có chắc muốn xóa bài "${title}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
}