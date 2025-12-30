// src/app/(admin)/admin/users/[id]/GradingView.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionSidebar } from './components/SubmissionSidebar';
import { SubmissionDetail } from './components/SubmissionDetail';
import { GradingForm } from './components/GradingForm';
import type { Submission } from '@/types/submission';

interface GradingViewProps {
  submissions: Submission[];
  userId: string;
}

export default function GradingView({ submissions, userId }: GradingViewProps) {
  const router = useRouter();
  // Mặc định chọn bài đầu tiên hoặc null
  const [selectedId, setSelectedId] = useState<string | null>(submissions[0]?.id || null);

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  const handleRefresh = () => {
    router.refresh(); // Refresh lại Server Component để lấy data mới nhất
  };

  if (!submissions || submissions.length === 0) {
    return <div className="p-8 text-center text-gray-500">Học viên chưa nộp bài tập nào.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-50 border-t border-gray-200">
      {/* Sidebar - Bên trái */}
      <SubmissionSidebar 
        submissions={submissions} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />

      {/* Main Content - Bên phải */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
        {selectedSubmission ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{selectedSubmission.lesson_title}</h1>
              <p className="text-gray-500">Đã nộp lúc: {new Date(selectedSubmission.created_at).toLocaleString('vi-VN')}</p>
            </div>

            <SubmissionDetail submission={selectedSubmission} />
            
            <GradingForm 
              key={selectedSubmission.id} // Quan trọng: reset form khi đổi bài
              submissionId={selectedSubmission.id}
              userId={userId}
              initialScore={selectedSubmission.score}
              initialFeedback={selectedSubmission.feedback}
              onSuccess={handleRefresh}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Chọn một bài nộp để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
}