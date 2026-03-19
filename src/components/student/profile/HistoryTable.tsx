// src/components/student/profile/HistoryTable.tsx
'use client';
import { useState } from 'react';
import { TestRecord, TestCategory } from '@/types/profile';
import { ChevronDown, ChevronUp } from 'lucide-react';

const getBadgeStyle = (type: TestCategory) => {
  switch (type) {
    case 'Đọc hiểu': return 'bg-orange-100 text-orange-600';
    case 'Ngữ pháp': return 'bg-purple-100 text-purple-600';
    case 'Nghe hiểu': return 'bg-green-100 text-green-600';
    case 'Tổng hợp': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export function HistoryTable({ records }: { records: TestRecord[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedRecords = isExpanded ? records : records.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Lịch sử kiểm tra</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">NGÀY</th>
              <th className="px-6 py-4">TÊN BÀI KIỂM TRA</th>
              <th className="px-6 py-4">LOẠI</th>
              <th className="px-6 py-4 text-right">ĐIỂM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedRecords.length > 0 ? (
              displayedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 text-gray-600">{record.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{record.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#7c3aed]">
                    {record.score.toFixed(2)}/10.00
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                  Không có dữ liệu làm bài
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
            <>Xem tất cả <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}