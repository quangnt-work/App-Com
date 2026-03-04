// src/components/common/Pagination.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
}

// Hàm tính toán mảng phân trang có chứa dấu "..."
const generatePagination = (currentPage: number, totalPages: number) => {
  // Nếu tổng số trang nhỏ hơn hoặc bằng 7, hiển thị toàn bộ
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Nếu trang hiện tại thuộc 3 trang đầu: [1, 2, 3, 4, '...', totalPages]
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  // Nếu trang hiện tại thuộc 3 trang cuối: [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // Nếu trang hiện tại nằm ở khoảng giữa: [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {/* Nút Previous */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border bg-white ${
          currentPage <= 1 
            ? 'pointer-events-none text-gray-300 border-gray-100' 
            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <span className="sr-only">Trang trước</span>
        <ChevronLeft size={20} />
      </Link>

      {/* Render các số trang và dấu "..." */}
      {allPages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors font-medium ${
              currentPage === page
                ? 'bg-[#f07b32] text-white border-[#f07b32] shadow-sm' // Trạng thái đang chọn
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' // Trạng thái bình thường
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Nút Next */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-lg border bg-white ${
          currentPage >= totalPages 
            ? 'pointer-events-none text-gray-300 border-gray-100' 
            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="sr-only">Trang sau</span>
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}