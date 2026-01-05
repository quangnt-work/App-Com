import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface PracticeRecord {
  id: string;
  title: string;
  skill: string;
  level: string;
  score: number;
  status: string;
  lastAccessed: string;
}

export function PracticeTable({ practices }: { practices: PracticeRecord[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Chi tiết luyện tập</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="p-4">Bài luyện tập</th>
              <th className="p-4">Kỹ năng</th>
              <th className="p-4">Cấp độ</th>
              <th className="p-4">Điểm số</th>
              <th className="p-4 text-right">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {practices.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{p.title}</td>
                <td className="p-4 capitalize">
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                    {p.skill}
                  </span>
                </td>
                <td className="p-4">
                    <span className={`text-xs font-bold ${
                        p.level === 'Hard' || p.level === 'C1' ? 'text-red-500' : 'text-green-600'
                    }`}>
                        {p.level}
                    </span>
                </td>
                <td className="p-4 font-semibold text-gray-800">{p.score.toFixed(1)}</td>
                <td className="p-4 text-right text-gray-500">
                  {new Date(p.lastAccessed).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
             {practices.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Chưa có bài luyện tập nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}