// src/components/student/profile/ProfileClient.tsx
'use client';
import { useState } from 'react';
import { UserProfileCard } from '@/components/student/profile/UserProfileCard';
import { ProgressChart } from '@/components/student/profile/ProgressChart';
import { HistoryTable } from '@/components/student/profile/HistoryTable';
import { UserProfile, TestRecord, ChartDataPoint } from '@/types/profile';

interface ProfileClientProps {
  profile: UserProfile;
  history: TestRecord[];
  chartData: ChartDataPoint[];
}

export function ProfileClient({ profile, history, chartData }: ProfileClientProps) {

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 md:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto">

        {/* Layout Grid: 1 cột cho Mobile, 3 cột cho Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cột Trái: Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard profile={profile} />
          </div>

          {/* Cột Phải: Thống kê & Lịch sử */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Thống kê & Bộ lọc */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Thống kê học tập</h2>
            </div>

            {/* Chart */}
            <ProgressChart data={chartData} />

            {/* History Table */}
            <HistoryTable records={history} />

          </div>
        </div>
      </div>
    </div>
  );
}
