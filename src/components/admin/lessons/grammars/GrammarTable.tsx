"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText, FileUp, FileSignature } from "lucide-react";
import DeleteGrammarButton from "./DeleteGrammarButton";
import { format, isValid, parseISO } from "date-fns";
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
import { GrammarPreviewModal } from "./GrammarPreviewModal";
import { Grammar } from "@/types/grammar";

interface GrammarTableProps {
  data: Grammar[];
}

export default function GrammarTable({ data }: GrammarTableProps) {
  const [previewGrammar, setPreviewGrammar] = useState<Grammar | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (grammar: Grammar) => {
    setPreviewGrammar(grammar);
    setIsPreviewOpen(true);
  };

  // Render Icon giả lập định dạng PDF, Word, v.v.
  const renderFormatIcons = (type?: string | null) => {
    const t = type?.toLowerCase();
    return (
      <div className="flex items-center justify-center gap-2">
        {t === 'file' ? (
          <>
            <FileText className="w-5 h-5 text-red-500" />
            <FileSignature className="w-5 h-5 text-blue-600" />
          </>
        ) : t === 'video' ? (
          <FileUp className="w-5 h-5 text-orange-500" />
        ) : (
          <FileText className="w-5 h-5 text-blue-500" />
        )}
      </div>
    );
  };

  const safeFormatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy", { locale: vi }) : "-";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left">
          <TableHeader className="bg-white border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
            <TableRow className="hover:bg-white">
              <TableHead className="py-5 px-6 font-bold w-[45%]">TÊN BÀI HỌC</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">ĐỊNH DẠNG</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">NGÀY TẠO</TableHead>
              <TableHead className="py-5 px-6 font-bold text-center">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {data.map((lesson) => (
              <TableRow key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Tên bài học */}
                <TableCell className="py-4 px-6 text-gray-800">
                  {lesson.title}
                </TableCell>

                {/* Định dạng */}
                <TableCell className="py-4 px-6 text-center">
                  {renderFormatIcons(lesson.type)}
                </TableCell>

                {/* Ngày tạo */}
                <TableCell className="py-4 px-6 text-center text-gray-500">
                  {safeFormatDate(lesson.created_at)}
                </TableCell>

                {/* Thao tác */}
                <TableCell className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Xem trước bài học"
                      className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(lesson);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button asChild variant="ghost" size="icon" aria-label="Chỉnh sửa bài học" className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                      <Link href={`/admin/lessons/grammars/${lesson.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    <DeleteGrammarButton id={lesson.id} title={lesson.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p>Không tìm thấy bài học nào.</p>
          </div>
        )}
      </div>

      <GrammarPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        grammar={previewGrammar}
      />
    </>
  );
}