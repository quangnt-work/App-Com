// src/app/(admin)/admin/users/[id]/components/SubmissionSidebar.tsx
import { CheckCircle, Circle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils'; // Giả sử bạn có utility này từ shadcn/ui
import type { Submission } from '@/types/submission'; // Import type của bạn

interface SubmissionSidebarProps {
  submissions: Submission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SubmissionSidebar({ submissions, selectedId, onSelect }: SubmissionSidebarProps) {
  return (
    <div className="w-full md:w-80 border-r border-gray-200 bg-white h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Danh sách bài nộp</h3>
        <p className="text-sm text-gray-500 mt-1">{submissions.length} bài tập</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {submissions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={cn(
              "w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3",
              selectedId === sub.id && "bg-blue-50 hover:bg-blue-50 ring-1 ring-inset ring-blue-100"
            )}
          >
            <div className="mt-1">
              {sub.score !== null ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div>
              <p className={cn("font-medium text-sm", selectedId === sub.id ? "text-blue-900" : "text-gray-900")}>
                {sub.lesson_title || "Bài tập không tên"}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {new Date(sub.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}