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
      return 'bg-green-100 text-green-700'; // Beginner
    case 'A2':
      return 'bg-blue-100 text-blue-700'; // Elementary
    case 'B1':
      return 'bg-yellow-100 text-yellow-700'; // Intermediate
    case 'B2':
      return 'bg-orange-100 text-orange-700'; // Upper Intermediate
    case 'C1':
    case 'C2':
      return 'bg-red-100 text-red-700'; // Advanced
    default:
      return 'bg-gray-100 text-gray-700'; // Unknown
  }
}