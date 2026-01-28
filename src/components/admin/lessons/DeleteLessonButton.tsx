"use client";


import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteLesson } from "@/actions/lesson-actions";
import { toast } from "sonner";
import { useTransition } from "react";


export default function DeleteLessonButton({ id, title }: { id: string, title: string }) {
  const [isPending, startTransition] = useTransition();


  const handleDelete = () => {
    if (confirm(`Bạn có chắc muốn xóa bài "${title}"? hành động này không thể hoàn tác.`)) {
      startTransition(async () => {
        const res = await deleteLesson(id);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
      });
    }
  };


  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
