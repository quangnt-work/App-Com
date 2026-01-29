"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText, Video, ListFilter, Music } from "lucide-react"; // Thêm icon Music nếu cần
import { Badge } from "@/components/ui/badge";
import DeleteLessonButton from "./DeleteLessonButton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LessonPreviewModal } from "./lesson-preview-modal";

// 1. Cập nhật Type cho đầy đủ (để Modal dùng được)
type Lesson = {
  id: string;
  title: string;
  category: string | null;
  status: string | null;
  thumbnail: string | null;
  created_at: string | null;
  type: string | null;
  content?: string;   // Thêm các trường cần thiết cho Modal
  videoUrl?: string;
  audioUrl?: string;
};

interface LessonTableProps {
  data: Lesson[];
}

export default function LessonTable({ data }: LessonTableProps) {
  // 2. Sử dụng Type Lesson thay vì any
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (lesson: Lesson) => {
    setPreviewLesson(lesson);
    setIsPreviewOpen(true);
  };

  const getTypeIcon = (type: string | null) => {
    // Chuẩn hóa input về chữ thường để so sánh chính xác
    const typeKey = type?.toLowerCase();
    switch (typeKey) {
      case "video": return <Video className="w-4 h-4 text-blue-500" />;
      case "text": return <FileText className="w-4 h-4 text-orange-500" />;
      case "audio": return <Music className="w-4 h-4 text-purple-500" />;
      default: return <ListFilter className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left">
          <TableHeader className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <TableRow>
              <TableHead className="py-4 px-6 w-[300px]">TIÊU ĐỀ</TableHead>
              <TableHead className="py-4 px-6">DANH MỤC</TableHead>
              <TableHead className="py-4 px-6">LOẠI</TableHead>
              <TableHead className="py-4 px-6">NGÀY TẠO</TableHead>
              <TableHead className="py-4 px-6 text-center">TRẠNG THÁI</TableHead>
              <TableHead className="py-4 px-6 text-right">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {data.map((lesson) => (
              <TableRow
                key={lesson.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {/* Cột Tiêu đề */}
                <TableCell className="py-4 px-6 font-medium text-slate-700">
                  {lesson.title}
                </TableCell>

                {/* Cột Danh Mục */}
                <TableCell className="py-4 px-6">
                  <Badge
                    variant="outline"
                    className="font-normal text-slate-600 bg-slate-100 border-slate-200 whitespace-nowrap"
                  >
                    {lesson.category || "Chưa phân loại"}
                  </Badge>
                </TableCell>

                {/* Cột Loại */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 capitalize text-slate-600">
                    {getTypeIcon(lesson.type)}
                    <span>{lesson.type || "Khác"}</span>
                  </div>
                </TableCell>

                {/* Cột Ngày Tạo */}
                <TableCell className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  {lesson.created_at
                    ? format(new Date(lesson.created_at), "dd/MM/yyyy", {
                        locale: vi,
                      })
                    : "-"}
                </TableCell>

                {/* Cột Trạng Thái */}
                <TableCell className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      lesson.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        lesson.status === "published"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {lesson.status === "published" ? "Công khai" : "Nháp"}
                  </span>
                </TableCell>

                {/* Cột Hành Động */}
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    
                    {/* SỬA CHÍNH: Bỏ thẻ Link, chỉ dùng Button mở Modal */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                      onClick={(e) => {
                         e.stopPropagation(); // Ngăn sự kiện nổi bọt nếu có
                         handlePreview(lesson);
                      }}
                      title="Xem trước"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Link href={`/admin/lessons/${lesson.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <DeleteLessonButton id={lesson.id} title={lesson.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <div className="flex justify-center mb-4">
               <ListFilter className="w-12 h-12 text-slate-200" />
            </div>
            <p>Không tìm thấy bài học nào phù hợp.</p>
          </div>
        )}
      </div>

      <LessonPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        lesson={previewLesson}
      />
    </div>
  );
}