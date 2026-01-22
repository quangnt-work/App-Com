// src/components/admin/courses/CourseTable.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils"; // Hàm format tiền tệ helper
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"; // Icons

interface CourseTableProps {
  data: any[]; // Nên define Type Course đầy đủ thay vì any
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export default function CourseTable({
  data,
  totalCount,
  currentPage,
  pageSize,
}: CourseTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tính toán số trang
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  // Hàm chuyển trang: Update URL Search Params
  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Table Content */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên khóa học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy khóa học nào.
                </TableCell>
              </TableRow>
            ) : (
              data.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell>
                    <Badge variant={course.is_published ? "default" : "secondary"}>
                      {course.is_published ? "Công khai" : "Nháp"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(course.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Thêm nút xóa có xác nhận tại đây */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị <strong>{(currentPage - 1) * pageSize + 1}</strong> đến{" "}
          <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> trong tổng số{" "}
          <strong>{totalCount}</strong> khóa học
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Trước
          </Button>
          <div className="text-sm font-medium">
            Trang {currentPage} / {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}