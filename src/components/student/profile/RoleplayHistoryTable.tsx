'use client';
import React, { useState } from 'react';
import { Clock, CheckCircle, MessagesSquare, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { RoleplayHistoryRecord } from '@/types/profile';
import { RoleplayHistoryDetailModal } from './RoleplayHistoryDetailModal';
import { getLevelBadgeClass } from '@/lib/utils';

interface RoleplayHistoryTableProps {
  records: RoleplayHistoryRecord[];
}

export function RoleplayHistoryTable({ records }: RoleplayHistoryTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<RoleplayHistoryRecord | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Group records by scenarioId
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.scenarioId]) {
      acc[record.scenarioId] = {
        topicTitle: record.topicTitle,
        scenarioId: record.scenarioId,
        records: []
      };
    }
    acc[record.scenarioId].records.push(record);
    return acc;
  }, {} as Record<string, { topicTitle: string; scenarioId: string; records: RoleplayHistoryRecord[] }>);

  const topics = Object.values(groupedRecords);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Lịch sử luyện tập Roleplay AI</h3>
          <div className="text-sm text-gray-500 font-medium">Tổng số: {topics.length} kịch bản đã học</div>
        </div>
        
        {topics.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessagesSquare className="text-gray-400" size={32} />
            </div>
            <p className="font-medium text-gray-600">Bạn chưa có lịch sử luyện tập Roleplay nào.</p>
            <p className="text-sm text-gray-400 mt-1">Hãy tham gia thử thách nhập vai để xem lại hội thoại nhé!</p>
          </div>
        ) : (
          <div className="p-6 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div key={topic.scenarioId} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#f07b32]/30 hover:shadow-md transition-all flex flex-col h-full relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getLevelBadgeClass(topic.records[0]?.level || '')}`}>
                      Cấp độ {topic.records[0]?.level || 'A1'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      Đã học {topic.records.length} lần
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 mb-5 group-hover:text-[#f07b32] transition-colors">{topic.topicTitle}</h4>
                  
                  <div className="mt-auto border-t border-dashed border-gray-200 pt-4 space-y-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Lịch sử làm bài</p>
                    
                    {/* Render up to 3 most recent records */}
                    {topic.records.slice(0, 3).map((r) => {
                      const isCompleted = r.completedObjectives === r.totalObjectives;
                      return (
                        <div key={r.id} className="flex items-center justify-between text-sm group/record">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock size={14} className="text-gray-400" />
                            <span>{r.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                              <span className="font-medium hidden sm:inline">Nhiệm vụ:</span>
                              <span className="font-bold">{r.completedObjectives}/{r.totalObjectives}</span>
                              {isCompleted && <CheckCircle size={12} className="ml-0.5" />}
                            </div>
                            <button 
                              onClick={() => setSelectedRecord(r)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors flex items-center justify-center tooltip-trigger"
                              title="Xem đoạn chat"
                            >
                              <MessagesSquare size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Expand button if more than 3 */}
                    {topic.records.length > 3 && (
                      <button 
                        onClick={() => setExpandedTopicId(expandedTopicId === topic.scenarioId ? null : topic.scenarioId)}
                        className="w-full py-2 mt-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        {expandedTopicId === topic.scenarioId ? (
                          <>Thu gọn <ChevronUp size={16} /></>
                        ) : (
                          <>Xem thêm {topic.records.length - 3} lần <ChevronDown size={16} /></>
                        )}
                      </button>
                    )}

                    {/* Expanded view for remaining records */}
                    {expandedTopicId === topic.scenarioId && topic.records.length > 3 && (
                      <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {topic.records.slice(3).map((r) => {
                          const isCompleted = r.completedObjectives === r.totalObjectives;
                          return (
                            <div key={r.id} className="flex items-center justify-between text-sm group/record">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock size={14} className="text-gray-400" />
                                <span>{r.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                                  <span className="font-medium hidden sm:inline">Nhiệm vụ:</span>
                                  <span className="font-bold">{r.completedObjectives}/{r.totalObjectives}</span>
                                  {isCompleted && <CheckCircle size={12} className="ml-0.5" />}
                                </div>
                                <button 
                                  onClick={() => setSelectedRecord(r)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                  title="Xem đoạn chat"
                                >
                                  <MessagesSquare size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
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
