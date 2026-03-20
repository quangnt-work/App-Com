// src/components/admin/students/StudentExamHistory.tsx
"use client";
import React from 'react';
import { Eye } from 'lucide-react';
import { Database } from '@/types/database.type';

type SubmissionStatus = Database['public']['Enums']['submission_status'];

export interface ExamHistoryRecord {
  id: string;
  created_at: string | null;
  score: number | null;
  total_score: number | null;
  status: SubmissionStatus | null;
  exams: {
    title: string;
    exam_type: string;
    pass_score: number | null;
  } | null;
}

interface StudentExamHistoryProps {
  submissions: ExamHistoryRecord[];
}

function TypeBadge({ type }: { type: string }) {
  const lower = type.toLowerCase();
  if (lower.includes('đọc') || lower === 'reading') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">Đọc hiểu</span>;
  if (lower.includes('ngữ pháp') || lower === 'grammar') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600">Ngữ pháp</span>;
  if (lower.includes('nghe') || lower === 'listening') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">Nghe hiểu</span>;
  return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">{type}</span>;
}

function StatusBadge({ status, score, passScore }: { status: SubmissionStatus | null, score: number | null, passScore: number | null }) {
  if (status === 'pending' || status === 'in_progress') {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">Đang làm</span>;
  }
  
  // Logic đạt/chưa đạt dựa vào passScore
  const isPassed = (score ?? 0) >= (passScore ?? 0);
  
  return isPassed ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
      ✓ Đạt
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-500">
      ✗ Chưa đạt
    </span>
  );
}

export function StudentExamHistory({ submissions }: StudentExamHistoryProps) {
  // Nhóm theo exam_id nếu cần đếm số lần làm, nhưng user muốn từng dòng chi tiết
  // Cho nên ở đây sẽ render từng submission
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800">Lịch sử bài kiểm tra</h3>
        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
          {submissions.length} bài đã nộp
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Ngày làm</th>
              <th className="px-6 py-4">Tên bài kiểm tra</th>
              <th className="px-6 py-4 text-center">Loại bài</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Kết quả</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {submissions.length > 0 ? (
              submissions.map((sub, index) => (
                <tr key={sub.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : '—'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 max-w-[200px] truncate" title={sub.exams?.title ?? "Không xác định"}>
                    {sub.exams?.title ?? "Không xác định"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <TypeBadge type={sub.exams?.exam_type ?? 'Tổng hợp'} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={sub.status} score={sub.score} passScore={sub.exams?.pass_score ?? 0} />
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-orange-600">
                    {sub.score !== null ? (
                      <>{sub.score} <span className="font-normal text-gray-400">/ {sub.total_score ?? '?'}</span></>
                    ) : (
                      <span className="text-gray-400 font-normal">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => alert(`Tính năng xem chi tiết bài làm ${sub.id} đang phát triển`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                  Học viên này chưa thực hiện bài kiểm tra nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
