import React from 'react';
import { Submission } from '@/types/submission';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Helper để render badge trạng thái
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  
  const labels = {
    completed: 'Đạt',
    pending: 'Đang chấm',
    failed: 'Chưa đạt',
  };

  const currentStyle = styles[status as keyof typeof styles] || styles.pending;
  const currentLabel = labels[status as keyof typeof labels] || 'Không xác định';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {currentLabel}
    </span>
  );
};

export function SubmissionTable({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-600" />
          Lịch sử làm bài
        </h3>
        <span className="text-sm text-gray-500">Tổng số: {submissions.length} bài</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-4">Tên bài thi</th>
              <th className="p-4">Ngày nộp</th>
              <th className="p-4">Thời gian</th>
              <th className="p-4 text-center">Điểm số</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{sub.examTitle}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                    <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {sub.duration}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${sub.score >= 5 ? 'text-sky-600' : 'text-red-500'}`}>
                      {sub.score}
                    </span>
                    <span className="text-gray-400 text-xs">/{sub.totalScore}</span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/submissions/${sub.id}`} 
                      className="text-sky-600 hover:text-sky-700 font-medium text-xs hover:underline"
                    >
                      Xem bài làm
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Học viên này chưa làm bài kiểm tra nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}