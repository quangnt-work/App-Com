'use client';

import React from 'react';
import Link from 'next/link'; // Dùng Link để điều hướng
import { 
  BookOpen, Headphones, Mic, PenTool, Layers, Type, ArrowRight 
} from 'lucide-react';

const SKILL_CONFIG = [
  { id: 'listening', label: 'Listening', vnLabel: 'Nghe hiểu', icon: Headphones, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', hover: 'group-hover:bg-amber-600 group-hover:text-white' },
  { id: 'speaking', label: 'Speaking', vnLabel: 'Nói & Phát âm', icon: Mic, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', hover: 'group-hover:bg-rose-600 group-hover:text-white' },
  { id: 'reading', label: 'Reading', vnLabel: 'Đọc hiểu', icon: BookOpen, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', hover: 'group-hover:bg-sky-600 group-hover:text-white' },
  { id: 'writing', label: 'Writing', vnLabel: 'Viết', icon: PenTool, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', hover: 'group-hover:bg-emerald-600 group-hover:text-white' },
  { id: 'vocabulary', label: 'Vocabulary', vnLabel: 'Từ vựng', icon: Type, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', hover: 'group-hover:bg-cyan-600 group-hover:text-white' },
  { id: 'grammar', label: 'Grammar', vnLabel: 'Ngữ pháp', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', hover: 'group-hover:bg-purple-600 group-hover:text-white' },
];

interface SkillCategoryCardsProps {
  stats: Record<string, number>;
}

export function SkillCategoryCards({ stats }: SkillCategoryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKILL_CONFIG.map((skill) => {
        const Icon = skill.icon;
        const count = stats[skill.id] || 0;

        return (
          <Link
            key={skill.id}
            href={`/practice/${skill.id}`} // Điều hướng sang trang chi tiết
            className={`group relative flex flex-col p-6 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${skill.bg} ${skill.color} ${skill.hover}`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {count} bài tập
              </span>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{skill.label}</h3>
              <p className="text-sm text-gray-500">{skill.vnLabel}</p>
            </div>

            {/* Hover Icon */}
            <div className="absolute bottom-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className={`w-5 h-5 ${skill.color}`} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}