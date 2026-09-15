// src/components/common/Pagination.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  itemLabel?: string; // Ví dụ: "đề thi", "bài học", "học viên"
  className?: string;
  theme?: 'blue' | 'orange';
}

// Hàm sinh mảng trang có dấu "..." thông minh
const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

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

export function Pagination({
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
  pageSize,
  totalItems,
  itemLabel,
  className = '',
  theme,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tự động tính currentPage
  const currentPage =
    propCurrentPage ?? (Number(searchParams.get('page')) || 1);

  // Tự động tính totalPages từ totalItems và pageSize nếu có
  const totalPages =
    propTotalPages ??
    (totalItems && pageSize ? Math.ceil(totalItems / pageSize) : 1);

  // Mặc định theme: nếu có itemLabel (thường ở Admin) thì chọn 'orange', ngược lại 'blue'
  const activeTheme = theme ?? (itemLabel ? 'orange' : 'blue');

  if (totalPages <= 1 && !totalItems) return null;
  if (totalItems === 0) return null;

  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const startItem = pageSize
    ? Math.min((currentPage - 1) * pageSize + 1, totalItems ?? 0)
    : null;
  const endItem = pageSize
    ? Math.min(currentPage * pageSize, totalItems ?? 0)
    : null;

  const activePageBtnStyle =
    activeTheme === 'orange'
      ? 'bg-[#f97316] text-white shadow-sm border-transparent'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs shadow-blue-500/20';

  return (
    <div
      className={`flex flex-col sm:flex-row items-center ${
        itemLabel ? 'justify-between' : 'justify-center'
      } w-full gap-4 ${className}`}
    >
      {/* Label Range Text nếu có */}
      {itemLabel && totalItems !== undefined && startItem !== null && endItem !== null && (
        <div className="text-sm text-gray-500">
          Hiển thị {startItem}–{endItem} trên tổng số{' '}
          <span className="font-semibold text-gray-700">{totalItems}</span> {itemLabel}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Nút Previous */}
        <Link
          href={createPageURL(Math.max(1, currentPage - 1))}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border bg-white transition-colors ${
            currentPage <= 1
              ? 'pointer-events-none text-slate-300 border-slate-100'
              : 'text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          aria-disabled={currentPage <= 1}
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </Link>

        {/* Số trang */}
        {allPages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-xs text-slate-400 font-bold"
              >
                …
              </span>
            );
          }

          const isCurrent = currentPage === page;

          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                isCurrent
                  ? activePageBtnStyle
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {page}
            </Link>
          );
        })}

        {/* Nút Next */}
        <Link
          href={createPageURL(Math.min(totalPages, currentPage + 1))}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border bg-white transition-colors ${
            currentPage >= totalPages
              ? 'pointer-events-none text-slate-300 border-slate-100'
              : 'text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          aria-disabled={currentPage >= totalPages}
          aria-label="Trang sau"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default Pagination;