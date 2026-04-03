// src/components/student/profile/HistoryTable.tsx
'use client';
import { useState } from 'react';
import { TestRecord, TestCategory } from '@/types/profile';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { ExamResultModal } from './ExamResultModal';

// ─── Helper sub-components ────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TestCategory }) {
  const styles: Record<TestCategory, string> = {
    'Đọc hiểu': 'bg-orange-100 text-orange-600',
    'Ngữ pháp': 'bg-purple-100 text-purple-600',
    'Nghe hiểu': 'bg-green-100 text-green-600',
    'Tổng hợp': 'bg-blue-100 text-blue-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[type]}`}>
      {type}
    </span>
  );
}

function PassBadge({ passed }: { passed: boolean }) {
  return passed ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
      ✓ Đạt
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-500">
      ✗ Chưa đạt
    </span>
  );
}

function ScoreCell({ score, total }: { score: number; total: number }) {
  return (
    <span className="font-bold text-[#7c3aed]">
      {score.toFixed(2)}
      <span className="font-normal text-gray-400">/{total.toFixed(0)}</span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface HistoryTableProps {
  records: TestRecord[];
}

export function HistoryTable({ records }: HistoryTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);

  const displayedRecords = isExpanded ? records : records.slice(0, 10);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Lịch sử kiểm tra</h3>
          <span className="text-xs text-gray-400 font-medium">{records.length} bài đã làm</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Ngày</th>
                <th className="px-5 py-3.5">Tên bài kiểm tra</th>
                <th className="px-5 py-3.5">Loại</th>
                <th className="px-5 py-3.5 text-center">Cấp độ</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Điểm</th>
                <th className="px-5 py-3.5 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 max-w-[180px] truncate">
                      {record.name}
                    </td>
                    <td className="px-5 py-4">
                      <TypeBadge type={record.type} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1.5 min-w-[36px] rounded-lg text-xs font-bold bg-slate-100/80 text-slate-600 border border-slate-200 uppercase tracking-wider">
                        {record.examLevel && record.examLevel !== '-' ? record.examLevel : 'ALL'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <PassBadge passed={record.passed} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ScoreCell score={record.score} total={record.totalScore} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition"
                      >
                        <Eye size={14} />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 italic text-sm">
                    Bạn chưa có bài kiểm tra nào. Hãy bắt đầu luyện tập!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {records.length > 10 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-4 text-sm font-bold text-[#7c3aed] flex items-center justify-center gap-1 hover:bg-purple-50 transition"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp size={16} /></>
            ) : (
              <>Xem tất cả ({records.length}) <ChevronDown size={16} /></>
            )}
          </button>
        )}
      </div>

      {/* Result Modal */}
      {selectedRecord && (
        <ExamResultModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}