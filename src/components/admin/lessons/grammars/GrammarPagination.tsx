"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface GrammarPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  // hasNextPage: boolean; // Không cần thiết nữa vì ta sẽ tự tính toán
}


export function GrammarPagination({
  currentPage,
  pageSize,
  totalItems,
}: GrammarPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();


  // 1. Tính toán tổng số trang
  const totalPages = Math.ceil(totalItems / pageSize);


  // 2. Logic kiểm tra nút Next/Prev
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;


  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };


  // Nếu không có dữ liệu hoặc chỉ có 1 trang thì ẩn phân trang đi cho gọn
  if (totalPages <= 1) return null;


  return (
    <div className="flex items-center justify-between px-2 py-4 w-full">
      {/* Hiển thị thông tin chi tiết: 1-10 of 50 */}
      <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
        Hiển thị <strong>{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong> -{" "}
        <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> trên tổng số{" "}
        <strong>{totalItems}</strong> kết quả
      </div>


      <div className="flex items-center space-x-6 lg:space-x-8 ml-auto">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </div>
       
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon" // Dùng size icon cho đẹp
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            <span className="sr-only">Trang trước</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
         
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Trang sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}