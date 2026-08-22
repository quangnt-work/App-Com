"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExamPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function ExamPagination({
  currentPage,
  pageSize,
  totalItems,
}: ExamPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
      {/* Label Text */}
      <div className="text-sm text-gray-500">
        Hiển thị {startItem}-{endItem} trên tổng số {totalItems} đề thi
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        <button
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
              currentPage === page
                ? "bg-[#f97316] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
