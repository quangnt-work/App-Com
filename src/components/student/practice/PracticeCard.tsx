'use client';

import React from 'react';
import Link from 'next/link';
import { PracticeSetWithProgress } from '@/types/practice';
import { Play, CheckCircle2, Clock, BarChart } from 'lucide-react';

const SKILL_COLORS: Record<string, string> = {
  reading: 'bg-blue-100 text-blue-700',
  listening: 'bg-amber-100 text-amber-700',
  speaking: 'bg-rose-100 text-rose-700',
  writing: 'bg-emerald-100 text-emerald-700',
  grammar: 'bg-purple-100 text-purple-700',
  vocabulary: 'bg-cyan-100 text-cyan-700',
};

export function PracticeCard({ item }: { item: PracticeSetWithProgress }) {
  const isCompleted = item.progress?.status === 'completed';
  const skillColor = SKILL_COLORS[item.skill.toLowerCase()] || 'bg-gray-100 text-gray-700';

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
      {/* Thumbnail area */}
      <div className="h-32 bg-gray-50 relative overflow-hidden">
        {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
            <div className={`w-full h-full flex items-center justify-center opacity-20 ${skillColor.split(' ')[0]}`}>
                <span className="text-4xl font-bold uppercase">{item.skill[0]}</span>
            </div>
        )}
        
        {/* Badge Skill */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${skillColor}`}>
            {item.skill}
          </span>
        </div>

        {/* Badge Level */}
        <div className="absolute top-3 right-3">
             <span className="bg-white/90 backdrop-blur text-gray-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-gray-100">
                {item.level}
             </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
          {item.title}
        </h3>
        
        <div className="mt-auto space-y-3">
            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.total_questions} câu</span>
                </div>
                {item.progress && (
                    <div className="flex items-center gap-1 font-medium text-sky-600">
                        <BarChart className="w-3.5 h-3.5" />
                        <span>Điểm: {item.progress.score.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <Link 
                href={`/practice/${item.id}`} // Đường dẫn vào làm bài
                className={`flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isCompleted 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm hover:shadow'
                }`}
            >
                {isCompleted ? (
                    <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Làm lại
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4 mr-2" fill="currentColor" />
                        {item.progress ? 'Tiếp tục' : 'Bắt đầu'}
                    </>
                )}
            </Link>
        </div>
      </div>
    </div>
  );
}