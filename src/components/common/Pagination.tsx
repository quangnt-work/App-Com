// src/components/common/Pagination.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  className?: string;
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

export function Pagination({ totalPages, className = "" }: PaginationProps) {
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
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Nút Previous */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border bg-white ${
          currentPage <= 1 
            ? 'pointer-events-none text-slate-300 border-slate-100' 
            : 'text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <span className="sr-only">Trang trước</span>
        <ChevronLeft size={16} />
      </Link>

      {/* Render các số trang và dấu "..." */}
      {allPages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center px-1 text-xs text-slate-400">
              ...
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border text-xs transition-all font-semibold ${
              currentPage === page
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs shadow-blue-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Nút Next */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border bg-white ${
          currentPage >= totalPages 
            ? 'pointer-events-none text-slate-300 border-slate-100' 
            : 'text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="sr-only">Trang sau</span>
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}