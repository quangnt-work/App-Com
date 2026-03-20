// src/components/profile/ProgressChart.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types/profile';

interface ProgressChartProps {
  data: ChartDataPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Tiến độ học tập 10 lần làm bài gần nhất</h3>
      <p className="text-xs text-gray-400 mb-6">T1 = lần làm đầu tiên</p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            {/* Trục hoành T1 -> T10 */}
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            {/* Trục tung thang điểm 10 */}
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />

            {/* Các đường biểu đồ tương ứng với từng loại kỹ năng */}
            <Line type="monotone" name="Đọc hiểu" dataKey="reading" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            <Line type="monotone" name="Ngữ pháp" dataKey="grammar" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            <Line type="monotone" name="Nghe hiểu" dataKey="listening" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
            <Line type="monotone" name="Tổng hợp" dataKey="mixed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}