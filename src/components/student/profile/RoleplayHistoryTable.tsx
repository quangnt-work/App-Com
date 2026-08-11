'use client';
import React, { useState } from 'react';
import { Clock, CheckCircle, MessagesSquare, Lightbulb } from 'lucide-react';
import { RoleplayHistoryRecord } from '@/types/profile';
import { RoleplayHistoryDetailModal } from './RoleplayHistoryDetailModal';

interface RoleplayHistoryTableProps {
  records: RoleplayHistoryRecord[];
}

export function RoleplayHistoryTable({ records }: RoleplayHistoryTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<RoleplayHistoryRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Lịch sử luyện tập Roleplay AI</h3>
          <div className="text-sm text-gray-500 font-medium">Tổng số: {records.length} bài</div>
        </div>
        
        {records.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessagesSquare className="text-gray-400" size={32} />
            </div>
            <p className="font-medium text-gray-600">Bạn chưa có lịch sử luyện tập Roleplay nào.</p>
            <p className="text-sm text-gray-400 mt-1">Hãy tham gia thử thách nhập vai để xem lại hội thoại nhé!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm">
                  <th className="py-4 px-6 font-semibold text-gray-500 w-48">Thời gian</th>
                  <th className="py-4 px-6 font-semibold text-gray-500">Chủ đề</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-center">Nhiệm vụ</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-center">Gợi ý</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {records.map((r) => {
                  const isCompleted = r.completedObjectives === r.totalObjectives;
                  
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={14} />
                          <span>{r.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-800">{r.topicTitle}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          Kéo dài {Math.floor(r.elapsedSeconds / 60)} phút {r.elapsedSeconds % 60} giây
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold ${
                          isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {isCompleted && <CheckCircle size={14} />}
                          {r.completedObjectives}/{r.totalObjectives}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5 text-gray-600">
                          <Lightbulb size={14} className={r.hintsUsed > 0 ? "text-amber-500" : "text-gray-400"} />
                          {r.hintsUsed}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setSelectedRecord(r)}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 font-semibold rounded-xl transition-colors"
                        >
                          Xem đoạn chat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRecord && (
        <RoleplayHistoryDetailModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </>
  );
}
