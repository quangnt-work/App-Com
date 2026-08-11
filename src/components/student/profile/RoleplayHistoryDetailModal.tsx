'use client';

import React from 'react';
import { X, User, Bot, AlertCircle } from 'lucide-react';
import { RoleplayHistoryRecord } from '@/types/profile';

interface Props {
  record: RoleplayHistoryRecord;
  onClose: () => void;
}

export function RoleplayHistoryDetailModal({ record, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-[#f8f9fc] rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-white rounded-t-3xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Lịch sử chat: {record.topicTitle}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
              <span>Nhiệm vụ: {record.completedObjectives}/{record.totalObjectives}</span>
              <span>Gợi ý đã dùng: {record.hintsUsed}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {record.messages.map((msg: any, idx: number) => {
            const isUser = msg.role === 'user';
            
            return (
              <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center shadow-sm ${
                  isUser ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {isUser ? <User size={20} /> : <Bot size={20} />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`p-4 rounded-2xl leading-relaxed shadow-sm ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.reply_vi && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 italic">
                        {msg.reply_vi}
                      </div>
                    )}
                  </div>
                  
                  {/* Grammar Correction */}
                  {msg.correction && (
                    <div className="mt-1 bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-xl flex items-start gap-2 shadow-sm w-full">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                      <p><strong>AI sửa lỗi:</strong> {msg.correction}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
