"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; 
import { deleteCourse } from "@/actions/course-actions"; 
import { ConfirmModal } from "@/components/modals/confirm-modal"; // Import component vừa tạo

export const CourseTableActions = ({ course }: { course: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false); // State để mở modal

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCourse(course.id);
      toast.success("Đã xóa khóa học thành công");
      router.refresh();
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setIsLoading(false);
      setOpen(false); // Đóng modal sau khi xong
    }
  };

  return (
    <>
      {/* 1. Modal xác nhận */}
      <ConfirmModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isLoading}
      />

      {/* 2. Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          {/* Khi bấm nút xóa, setOpen(true) để hiện Modal */}
          <DropdownMenuItem className="text-red-600" onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Xóa khóa học
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};