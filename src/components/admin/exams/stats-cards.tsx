import React from 'react'
import { Question } from '@/types/exam-custom'
import { Card, CardContent } from '@/components/ui/card'
import { Layers, CheckCircle2, AlertCircle } from 'lucide-react'

interface StatsCardsProps {
  questions: Question[];
}

export function StatsCards({ questions }: StatsCardsProps) {
  // Tính toán thống kê
  const totalQuestions = questions.reduce((acc, q) => {
    // Nếu là nhóm câu hỏi, cộng số câu con, ngược lại cộng 1
    return acc + (q.type === 'group' ? (q.sub_questions?.length || 0) : 1);
  }, 0);

  const totalScoreCurrent = questions.reduce((acc, q) => {
     if (q.type === 'group') {
       return acc + (q.sub_questions?.reduce((sAcc, sQ) => sAcc + (sQ.score || 0), 0) || 0);
     }
     return acc + (q.score || 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Số câu hỏi</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalQuestions}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-full text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng điểm hiện tại</p>
            <h3 className={`text-2xl font-bold ${totalScoreCurrent > 100 ? 'text-red-500' : 'text-slate-800'}`}>
              {totalScoreCurrent}
            </h3>
          </div>
          <div className={`p-2 rounded-full ${totalScoreCurrent === 100 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Dạng câu hỏi</p>
            <div className="flex gap-2 text-xs mt-1">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">TN: {questions.filter(q => q.type === 'multiple_choice').length}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Group: {questions.filter(q => q.type === 'group').length}</span>
            </div>
          </div>
          <div className="p-2 bg-purple-50 rounded-full text-purple-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}