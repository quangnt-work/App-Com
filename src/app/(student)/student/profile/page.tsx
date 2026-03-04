// src/app/(student)/profile/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserProfileCard } from '@/components/student/profile/UserProfileCard';
import { ProgressChart } from '@/components/student/profile/ProgressChart';
import { HistoryTable } from '@/components/student/profile/HistoryTable';
import { UserProfile, TestRecord, ChartDataPoint } from '@/types/profile';

// Mock Data
const mockProfile: UserProfile = {
  id: '1',
  name: 'Nguyễn Văn A',
  username: 'nguyenvana123',
  level: 'B1',
  email: 'nguyenvana@example.com',
  joinDate: '15/05/2023',
};

const mockChartData: ChartDataPoint[] = [
  { name: 'T1', grammar: 2, reading: 4, vocabulary: 3 },
  { name: 'T2', grammar: 3.5, listening: 5, vocabulary: 6 },
  { name: 'T3', grammar: 1, reading: 6.5 },
  { name: 'T4', grammar: 4.5, listening: 7, vocabulary: 8 },
  { name: 'T5', reading: 8.5, vocabulary: 9 },
  { name: 'T6', grammar: 5.5, listening: 8.5 },
  { name: 'T7', grammar: 6.5, reading: 9 },
  { name: 'T8', grammar: 4, vocabulary: 10 },
  { name: 'T9', grammar: 7, listening: 9 },
  { name: 'T10', grammar: 8.5, reading: 9.5, vocabulary: 10 },
];

const mockHistory: TestRecord[] = [
  { id: '1', date: '12/10/2023', name: 'Đề thi thử TRKI B1 - Phần Đọc', type: 'Đọc hiểu', score: 8.5 },
  { id: '2', date: '05/10/2023', name: 'Ngữ pháp cơ bản B1 - Bài 5', type: 'Ngữ pháp', score: 9.2 },
  { id: '3', date: '28/09/2023', name: 'Luyện nghe hội thoại hàng ngày', type: 'Nghe', score: 7.8 },
  { id: '4', date: '15/09/2023', name: 'Từ vựng chuyên đề Du lịch', type: 'Từ vựng', score: 10.0 },
];

export default function ProfilePage() {
  const [selectedMonth, setSelectedMonth] = useState('Tháng hiện tại');

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 md:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto">

        {/* Layout Grid: 1 cột cho Mobile, 3 cột cho Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cột Trái: Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard profile={mockProfile} />
          </div>

          {/* Cột Phải: Thống kê & Lịch sử */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Thống kê & Bộ lọc */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Thống kê học tập</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Kết quả theo:</span>
                <select 
                  className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="Tháng 3/2026">Tháng 3 / 2026</option>
                  <option value="Tháng 2/2026">Tháng 2 / 2026</option>
                  <option value="Tháng 1/2026">Tháng 1 / 2026</option>
                  <option value="Tháng 12/2025">Tháng 12 / 2025</option>
                </select>
              </div>
            </div>

            {/* Chart */}
            <ProgressChart data={mockChartData} />

            {/* History Table */}
            <HistoryTable records={mockHistory} />

          </div>
        </div>
      </div>
    </div>
  );
}