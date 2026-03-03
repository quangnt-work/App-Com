// src/components/student/ai/chat/ChatTopicCard.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ChatTopic } from '@/types/ai-chat';

interface Props {
  topic: ChatTopic;
}

export function ChatTopicCard({ topic }: Props) {
  return (
    <Link 
      href={topic.href}
      className={`group flex items-center p-5 rounded-2xl border ${topic.themeColor.bg} ${topic.themeColor.border} hover:shadow-md transition-all duration-300`}
    >
      {/* Icon khối tròn bên trái */}
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-6 shadow-sm bg-white ${topic.themeColor.iconColor}`}>
        {topic.icon}
      </div>

      {/* Nội dung text */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-black transition-colors">
          {topic.title}
        </h3>
        <p className="text-sm font-medium text-slate-500">
          {topic.description}
        </p>
      </div>

      {/* Mũi tên điều hướng */}
      <div className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all">
        <ChevronRight size={24} strokeWidth={2.5} />
      </div>
    </Link>
  );
}