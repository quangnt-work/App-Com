// src/components/student/ai/TopicCard.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Sparkles, Award } from 'lucide-react';

export interface TopicCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  badgeClass?: string;
  detail?: string;
  isDone?: boolean;
  isNew?: boolean;
  score?: string | number;
  index?: number;
  colorScheme?: 'blue' | 'indigo' | 'purple' | 'orange' | 'emerald' | 'rose' | 'cyan' | 'slate';
  iconColor?: string;
  iconBgColor?: string;
}

export function TopicCard({
  title,
  subtitle,
  description,
  icon,
  href,
  badge,
  badgeClass,
  detail,
  isDone,
  isNew,
  score,
  index,
  colorScheme = 'indigo',
  iconColor,
  iconBgColor
}: TopicCardProps) {
  // Bảng màu mặc định theo colorScheme
  const colorMap: Record<string, { bg: string; text: string; hoverBorder: string; hoverText: string }> = {
    blue: { bg: 'bg-blue-50/90 group-hover:bg-blue-100/90', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300', hoverText: 'group-hover:text-blue-600' },
    indigo: { bg: 'bg-indigo-50/90 group-hover:bg-indigo-100/90', text: 'text-indigo-600', hoverBorder: 'hover:border-indigo-300', hoverText: 'group-hover:text-indigo-600' },
    purple: { bg: 'bg-purple-50/90 group-hover:bg-purple-100/90', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300', hoverText: 'group-hover:text-purple-600' },
    orange: { bg: 'bg-amber-50/90 group-hover:bg-amber-100/90', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300', hoverText: 'group-hover:text-amber-600' },
    emerald: { bg: 'bg-emerald-50/90 group-hover:bg-emerald-100/90', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverText: 'group-hover:text-emerald-600' },
    rose: { bg: 'bg-rose-50/90 group-hover:bg-rose-100/90', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300', hoverText: 'group-hover:text-rose-600' },
    cyan: { bg: 'bg-sky-50/90 group-hover:bg-sky-100/90', text: 'text-sky-600', hoverBorder: 'hover:border-sky-300', hoverText: 'group-hover:text-sky-600' },
    slate: { bg: 'bg-slate-100/90 group-hover:bg-slate-200/90', text: 'text-slate-600', hoverBorder: 'hover:border-slate-300', hoverText: 'group-hover:text-slate-700' }
  };

  const scheme = colorMap[colorScheme] || colorMap.indigo;
  const activeBg = iconBgColor || scheme.bg;
  const activeText = iconColor || scheme.text;

  return (
    <Link 
      href={href}
      className={`group relative flex items-center p-3.5 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgb(99,102,241,0.12)] ${scheme.hoverBorder} hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full min-h-[92px] sm:min-h-[98px]`}
    >
      {/* Icon khối bo góc trái */}
      <div className={`w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl flex items-center justify-center mr-3.5 sm:mr-4 transition-all duration-300 group-hover:scale-105 shadow-2xs ${activeBg} ${activeText}`}>
        {icon}
      </div>

      {/* Nội dung text trung tâm */}
      <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
        {/* Hàng badge thông tin phụ (Cấp độ, số câu, điểm số, đã hoàn thành, mới) */}
        {(badge || detail || score !== undefined || isDone || isNew) && (
          <div className="flex items-center gap-1.5 mb-1 h-5 flex-nowrap overflow-hidden">
            {badge && (
              <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${badgeClass || 'bg-slate-100 text-slate-700'}`}>
                {badge}
              </span>
            )}
            {detail && (
              <span className="text-slate-500 bg-slate-100/80 text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded-md shrink-0 truncate max-w-[150px]">
                {detail}
              </span>
            )}
            {score !== undefined && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                <Award size={11} className="text-amber-500" /> {score}
              </span>
            )}
            {isDone && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                <CheckCircle size={11} /> Đã làm
              </span>
            )}
            {isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-100 flex items-center gap-0.5 shrink-0">
                <Sparkles size={10} /> MỚI
              </span>
            )}
          </div>
        )}

        {/* Tiêu đề chính */}
        <h3 className={`text-sm sm:text-[15px] font-bold text-slate-800 ${scheme.hoverText} transition-colors truncate leading-tight`}>
          {index !== undefined && (
            <span className="text-slate-400 mr-1.5 font-semibold text-xs sm:text-sm">{index}.</span>
          )}
          {title}
        </h3>

        {/* Phụ đề (tiếng Nga / vai trò đối thoại / câu mẫu) */}
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-indigo-600 font-semibold truncate leading-tight mt-0.5">
            {subtitle}
          </p>
        )}

        {/* Mô tả chi tiết (ngữ cảnh) */}
        {description && (
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate leading-tight mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Nút tròn điều hướng bên phải */}
      <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-slate-50/90 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all flex-shrink-0 shadow-2xs group-hover:translate-x-0.5">
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}