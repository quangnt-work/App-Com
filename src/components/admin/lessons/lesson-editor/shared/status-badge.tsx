// components/lessons/shared/status-badge.tsx
import { cn } from '@/lib/utils'; // Giả sử bạn có utility này (clsx + tailwind-merge)


// Định nghĩa các loại trạng thái và màu sắc tương ứng
const STATUS_STYLES = {
  published: {
    label: 'Công khai',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    border: 'border-green-200'
  },
  draft: {
    label: 'Bản nháp',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
    border: 'border-gray-200'
  },
  archived: {
    label: 'Lưu trữ',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
    border: 'border-yellow-200'
  },
  // Default fallback
  unknown: {
    label: 'Không xác định',
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    dot: 'bg-gray-300',
    border: 'border-gray-200'
  }
};


interface StatusBadgeProps {
  status: string; // 'published' | 'draft' | 'archived' ...
  className?: string;
}


export default function StatusBadge({ status, className }: StatusBadgeProps) {
  // Lấy style config dựa trên status, nếu không có thì dùng 'unknown'
  const config = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || STATUS_STYLES.unknown;


  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}