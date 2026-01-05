'use client';

import React from 'react';
import { Target, Trophy, Flame } from 'lucide-react';
import { PracticeSetWithProgress } from '@/types/practice';

export function PracticeStats({ data }: { data: PracticeSetWithProgress[] }) {
  // Tính toán chỉ số thật
  const completedItems = data.filter(i => i.progress?.status === 'completed');
  const totalCompleted = completedItems.length;
  
  // Điểm trung bình các bài đã làm
  const avgScore = totalCompleted > 0 
    ? completedItems.reduce((acc, curr) => acc + (curr.progress?.score || 0), 0) / totalCompleted 
    : 0;

  // Tính số bài theo Skill
  const statsBySkill = data.reduce((acc, curr) => {
    if (curr.progress) {
        acc[curr.skill] = (acc[curr.skill] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Tìm skill học nhiều nhất
  const bestSkill = Object.keys(statsBySkill).reduce((a, b) => statsBySkill[a] > statsBySkill[b] ? a : b, 'None');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Card 1: Tổng quan */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-sky-200">
        <div className="flex items-center gap-3 mb-2 opacity-90">
            <Trophy className="w-5 h-5" />
            <span className="font-medium text-sm">Điểm trung bình</span>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{avgScore.toFixed(1)}</span>
            <span className="mb-1 opacity-80 text-sm">/ 10</span>
        </div>
        <div className="mt-3 text-xs bg-white/20 inline-block px-2 py-1 rounded-full">
            Đã hoàn thành {totalCompleted} bài tập
        </div>
      </div>

      {/* Card 2: Kỹ năng nổi bật */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Target className="w-5 h-5 text-rose-500" />
            <span className="font-medium text-sm">Kỹ năng tập trung</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 capitalize">
            {bestSkill !== 'None' ? bestSkill : 'Chưa có dữ liệu'}
        </div>
        <p className="text-xs text-gray-400 mt-1">
            Dựa trên số lượng bài tập bạn đã làm gần đây.
        </p>
      </div>

      {/* Card 3: Streak (Giả lập hoặc lấy từ DB nếu có bảng streak) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-sm">Chuỗi học tập</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
            3 Ngày
        </div>
        <p className="text-xs text-gray-400 mt-1">
            Giữ vững phong độ để nhận huy hiệu!
        </p>
      </div>
    </div>
  );
}