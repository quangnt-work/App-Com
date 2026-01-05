import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string; // Ví dụ: "+5% tháng này"
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'sky' | 'green' | 'amber' | 'purple'; // Theme màu tùy chọn
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = 'neutral',
  color = 'sky' 
}: StatCardProps) {

  // Map màu sắc tương ứng
  const colorStyles = {
    sky: 'bg-sky-50 text-sky-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const trendColor = 
    trendDirection === 'up' ? 'text-green-600' : 
    trendDirection === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendColor}`}>
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colorStyles[color] || colorStyles.sky}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}