// src/components/student/profile/ProfileClient.tsx
'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UserProfileCard } from '@/components/student/profile/UserProfileCard';
import { HistoryTable } from '@/components/student/profile/HistoryTable';
import { RoleplayHistoryTable } from '@/components/student/profile/RoleplayHistoryTable';
import { ShadowingHistoryTable } from '@/components/student/profile/ShadowingHistoryTable';
import { UserProfile, TestRecord, ChartDataPoint, RoleplayHistoryRecord, ShadowingHistoryRecord } from '@/types/profile';

const ProgressChart = dynamic(
  () => import('@/components/student/profile/ProgressChart').then(mod => mod.ProgressChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 h-[380px] flex items-center justify-center animate-pulse">
        <div className="text-slate-400 text-sm font-medium">Đang tải biểu đồ tiến độ...</div>
      </div>
    ),
  }
);

interface ProfileClientProps {
  profile: UserProfile;
  history: TestRecord[];
  chartData: ChartDataPoint[];
  roleplayHistory: RoleplayHistoryRecord[];
  shadowingHistory: ShadowingHistoryRecord[];
}

export function ProfileClient({ profile, history, chartData, roleplayHistory, shadowingHistory }: ProfileClientProps) {

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

  const [activeTab, setActiveTab] = useState<'exam' | 'ai'>('exam');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-1.5 font-sans flex-1">

        {/* Layout Flex: Cột Trái cố định, Cột Phải co giãn - Đảm bảo KHÔNG BAO GIỜ đè lên nhau */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* Cột Trái: Profile Card */}
          <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0">
            <UserProfileCard profile={profile} />
          </div>

          {/* Cột Phải: Thống kê & Lịch sử */}
          <div className="flex-1 min-w-0 w-full space-y-6">

            {/* Header Thống kê & Bộ lọc */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Thống kê học tập</h2>
              
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('exam')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'exam' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Bài kiểm tra
                </button>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ai' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Lịch sử AI
                </button>
              </div>
            </div>

            {activeTab === 'exam' ? (
              <>
                {/* Chart */}
                <ProgressChart data={chartData} />

                {/* History Table */}
                <HistoryTable records={history} />
              </>
            ) : (
              <div className="space-y-6">
                <ShadowingHistoryTable records={shadowingHistory} />
                <RoleplayHistoryTable records={roleplayHistory} />
              </div>
            )}

          </div>
        </div>
      </div>
  );
}
