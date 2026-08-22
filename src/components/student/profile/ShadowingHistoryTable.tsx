'use client';
import React, { useState } from 'react';
import { Mic, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import { ShadowingHistoryRecord } from '@/types/profile';
import { getLevelBadgeClass } from '@/lib/utils';

interface ShadowingHistoryTableProps {
  records: ShadowingHistoryRecord[];
}

export function ShadowingHistoryTable({ records }: ShadowingHistoryTableProps) {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Group records by topicId
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.topicId]) {
      acc[record.topicId] = {
        topicTitle: record.topicTitle,
        topicId: record.topicId,
        records: []
      };
    }
    acc[record.topicId].records.push(record);
    return acc;
  }, {} as Record<string, { topicTitle: string; topicId: string; records: ShadowingHistoryRecord[] }>);

  const topics = Object.values(groupedRecords);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Lịch sử luyện tập Shadowing AI</h3>
        <div className="text-sm text-gray-500 font-medium">Tổng số: {topics.length} chủ đề đã học</div>
      </div>
      
        {topics.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="text-gray-400" size={32} />
            </div>
            <p className="font-medium text-gray-600">Bạn chưa có lịch sử luyện tập Shadowing nào.</p>
            <p className="text-sm text-gray-400 mt-1">Hãy tham gia thử thách đọc theo mẫu để cải thiện phát âm nhé!</p>
          </div>
        ) : (
          <div className="p-6 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div key={topic.topicId} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-400/30 hover:shadow-md transition-all flex flex-col h-full relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getLevelBadgeClass(topic.records[0]?.level || '')}`}>
                      Cấp độ {topic.records[0]?.level || 'A1'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      Đã học {topic.records.length} lần
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 mb-5 group-hover:text-blue-600 transition-colors">{topic.topicTitle}</h4>
                  
                  <div className="mt-auto border-t border-dashed border-gray-200 pt-4 space-y-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Lịch sử làm bài</p>
                    
                    {/* Render up to 3 most recent records */}
                    {topic.records.slice(0, 3).map((r) => {
                      const isCompleted = r.completedSentences === r.totalSentences;
                      return (
                        <div key={r.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock size={14} className="text-gray-400" />
                            <span>{r.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                              <span className="font-medium hidden sm:inline">Tiến độ:</span>
                              <span className="font-bold">{r.completedSentences}/{r.totalSentences}</span>
                              {isCompleted && <CheckCircle size={12} />}
                            </div>
                            <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">
                              <span className="font-medium">Điểm:</span>
                              <span className="font-bold">{r.score}/100</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Expand button if more than 3 */}
                    {topic.records.length > 3 && (
                      <button 
                        onClick={() => setExpandedTopicId(expandedTopicId === topic.topicId ? null : topic.topicId)}
                        className="w-full py-2 mt-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        {expandedTopicId === topic.topicId ? (
                          <>Thu gọn <ChevronUp size={16} /></>
                        ) : (
                          <>Xem thêm {topic.records.length - 3} lần <ChevronDown size={16} /></>
                        )}
                      </button>
                    )}

                    {/* Expanded view for remaining records */}
                    {expandedTopicId === topic.topicId && topic.records.length > 3 && (
                      <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {topic.records.slice(3).map((r) => {
                          const isCompleted = r.completedSentences === r.totalSentences;
                          return (
                            <div key={r.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock size={14} className="text-gray-400" />
                                <span>{r.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                                  <span className="font-medium hidden sm:inline">Tiến độ:</span>
                                  <span className="font-bold">{r.completedSentences}/{r.totalSentences}</span>
                                  {isCompleted && <CheckCircle size={12} />}
                                </div>
                                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">
                                  <span className="font-medium">Điểm:</span>
                                  <span className="font-bold">{r.score}/100</span>
                                </div>
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
    );
  }
