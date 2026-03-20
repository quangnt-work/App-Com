// src/components/admin/students/StudentPagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudentPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function StudentPagination({
  currentPage,
  pageSize,
  totalItems,
}: StudentPaginationProps) {
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

  // Show a smart window of page numbers
  const pages: number[] = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
      <div className="text-sm text-gray-500">
        Hiển thị {startItem}–{endItem} trên tổng số{" "}
        <span className="font-semibold text-gray-700">{totalItems}</span> học viên
      </div>

      <div className="flex items-center space-x-1">
        <button
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                …
              </span>
            )}
          </>
        )}

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

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                …
              </span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Trang sau"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
