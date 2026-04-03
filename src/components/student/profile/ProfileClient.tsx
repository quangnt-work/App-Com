// src/components/student/profile/ProfileClient.tsx
'use client';
import { useEffect } from 'react';
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

  useEffect(() => {
    // Push a dummy state so the current entry has something to intercept
    window.history.pushState({ profilePage: true }, '');

    const handlePopState = () => {
      // Always go home when pressing back from profile
      window.location.replace('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Layout Grid: 1 cột cho Mobile, 4 cột cho Desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">

          {/* Cột Trái: Profile Card */}
          <div className="xl:col-span-1 min-w-[300px]">
            <UserProfileCard profile={profile} />
          </div>

          {/* Cột Phải: Thống kê & Lịch sử */}
          <div className="xl:col-span-3 space-y-6 w-full overflow-hidden">

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
