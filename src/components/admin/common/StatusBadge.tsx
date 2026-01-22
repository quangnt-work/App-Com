// src/components/admin/common/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string | boolean; // Hỗ trợ cả boolean (published/draft)
  labels?: Record<string, string>; // Map status sang text hiển thị (VD: true -> "Công khai")
}

export function StatusBadge({ status, labels }: StatusBadgeProps) {
  // Normalize status
  const statusKey = String(status).toLowerCase();
  
  const styles: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    published: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    draft: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    false: "bg-amber-100 text-amber-700 hover:bg-amber-100", // e.g. is_published = false
  };

  const label = labels ? labels[String(status)] : status;

  return (
    <Badge variant="outline" className={cn("px-2.5 py-0.5 border-transparent font-medium", styles[statusKey] || styles.draft)}>
      {label}
    </Badge>
  );
}