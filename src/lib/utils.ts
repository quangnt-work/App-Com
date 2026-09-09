import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Thêm hàm này
export function formatDate(dateString: string | Date | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Kết quả: 30/12/2025
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function getLevelBadgeClass(level: string): string {
  const normalizedLevel = level?.toUpperCase();
  switch (normalizedLevel) {
    case 'A1':
      return 'bg-sky-50 text-sky-700 border border-sky-200/60 font-semibold'; // Beginner
    case 'A2':
      return 'bg-teal-50 text-teal-700 border border-teal-200/60 font-semibold'; // Elementary
    case 'B1':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold'; // Intermediate
    case 'B2':
      return 'bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold'; // Upper Intermediate
    case 'C1':
    case 'C2':
      return 'bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold'; // Advanced
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold'; // Unknown
  }
}