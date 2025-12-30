// src/app/(admin)/admin/users/[id]/components/SubmissionDetail.tsx
import { FileIcon, ExternalLink } from 'lucide-react';
import type { Submission } from '@/types/submission';

interface SubmissionDetailProps {
  submission: Submission;
}

export function SubmissionDetail({ submission }: SubmissionDetailProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Nội dung bài làm</h2>
      
      {/* Hiển thị Text nếu có */}
      {submission.content && (
        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <p className="whitespace-pre-wrap">{submission.content}</p>
        </div>
      )}

      {/* Hiển thị File đính kèm nếu có */}
      {submission.file_url && (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
          <div className="p-2 bg-white rounded border border-gray-200">
            <FileIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">File đính kèm</p>
            <a 
              href={submission.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              Xem tài liệu <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {!submission.content && !submission.file_url && (
        <p className="text-gray-500 italic text-center py-8">Học viên không gửi nội dung nào.</p>
      )}
    </div>
  );
}