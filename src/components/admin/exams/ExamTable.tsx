"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { ClipboardList, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExamDeleteButton from "./ExamDeleteButton";
import { ExamPreviewModal } from "./ExamPreviewModal";
import { Exam } from "@/types/database-custom";
import { EXAM_TYPE_LABELS, EXAM_LEVEL_LABELS } from "@/lib/schemas/exam";
import { Badge } from "@/components/ui/badge";

interface ExamTableProps {
  data: Exam[];
}

const safeFormatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date =
    typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
  return isValid(date) ? format(date, "dd/MM/yyyy", { locale: vi }) : "-";
};

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return "-";
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}p` : `${h} giờ`;
};

export default function ExamTable({ data }: ExamTableProps) {
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (exam: Exam) => {
    setPreviewExam(exam);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left">
          <TableHeader className="bg-white border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
            <TableRow className="hover:bg-white">
              <TableHead className="py-5 px-6 font-bold w-[35%]">TÊN ĐỀ THI</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">LOẠI ĐỀ THI</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">CẤP ĐỘ</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">THỜI GIAN</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">NGÀY TẠO</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {data.map((exam) => (
              <TableRow key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Tên đề thi */}
                <TableCell className="py-4 px-6 text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                      <ClipboardList className="w-4 h-4 text-[#f97316]" />
                    </div>
                    <span className="font-medium">{exam.title}</span>
                  </div>
                </TableCell>

                {/* Loại đề thi */}
                <TableCell className="py-4 px-6 text-center text-gray-600">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-100 font-medium">
                    {EXAM_TYPE_LABELS[exam.exam_type] || "Tổng hợp"}
                  </Badge>
                </TableCell>

                {/* Cấp độ */}
                <TableCell className="py-4 px-6 text-center text-gray-600">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50 border border-purple-100 font-medium whitespace-nowrap">
                    {EXAM_LEVEL_LABELS[exam.level] || "Mọi cấp độ"}
                  </Badge>
                </TableCell>

                {/* Thời gian */}
                <TableCell className="py-4 px-6 text-center text-gray-500">
                  {formatDuration(exam.duration)}
                </TableCell>

                {/* Ngày tạo */}
                <TableCell className="py-4 px-6 text-center text-gray-500">
                  {safeFormatDate(exam.created_at)}
                </TableCell>

                {/* Thao tác */}
                <TableCell className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Xem trước */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(exam);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {/* Chỉnh sửa */}
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <Link href={`/admin/exams/${exam.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    {/* Xóa */}
                    <ExamDeleteButton id={exam.id} title={exam.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có đề thi nào.</p>
          </div>
        )}
      </div>

      <ExamPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        exam={previewExam}
      />
    </>
  );
}
