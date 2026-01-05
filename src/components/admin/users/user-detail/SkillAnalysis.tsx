import React from 'react';
import { Book, Headphones, Mic, PenTool, Layers, Type } from 'lucide-react';

interface SkillData {
  skill: string;
  averageScore: number; // Thang 10 hoặc 100
  totalPractices: number;
}

const SKILL_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  reading: { label: 'Reading', icon: Book, color: 'text-blue-600', bg: 'bg-blue-600' },
  listening: { label: 'Listening', icon: Headphones, color: 'text-amber-600', bg: 'bg-amber-600' },
  speaking: { label: 'Speaking', icon: Mic, color: 'text-rose-600', bg: 'bg-rose-600' },
  writing: { label: 'Writing', icon: PenTool, color: 'text-emerald-600', bg: 'bg-emerald-600' },
  grammar: { label: 'Grammar', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-600' },
  vocabulary: { label: 'Vocabulary', icon: Type, color: 'text-cyan-600', bg: 'bg-cyan-600' },
};

export function SkillAnalysis({ data }: { data: SkillData[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full">
      <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <Layers className="w-5 h-5 text-sky-600" />
        Phân tích kỹ năng
      </h3>
      
      <div className="space-y-5">
        {data.map((item) => {
          const config = SKILL_CONFIG[item.skill.toLowerCase()] || SKILL_CONFIG.reading;
          const Icon = config.icon;
          
          return (
            <div key={item.skill}>
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  <span className="text-xs text-gray-400">({item.totalPractices} bài)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.averageScore.toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${config.bg}`} 
                  style={{ width: `${(item.averageScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu luyện tập kỹ năng.</p>
        )}
      </div>
    </div>
  );
}