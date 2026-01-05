// src/components/admin/practice/PracticeStats.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, CheckCircle2, Clock, Users } from 'lucide-react'

interface StatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    participants: number;
  }
}

export function PracticeStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Tổng bộ đề</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Đã công khai</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.published}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Bản nháp</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.draft}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Lượt làm bài</p>
            <h3 className="text-2xl font-bold text-slate-900">--</h3> {/* Placeholder */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}