import { ClipboardList, CheckCircle2, Trophy } from 'lucide-react'

export function PracticeStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {/* Card 1: Blue */}
       <div className="bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <ClipboardList className="absolute bottom-4 right-4 h-16 w-16 text-white opacity-20" />
          <h4 className="text-sm font-bold opacity-90 mb-1">Đang thực hiện</h4>
          <div className="text-4xl font-extrabold mb-1">12</div>
          <p className="text-xs opacity-80">Bài tập chưa hoàn thành</p>
       </div>

       {/* Card 2: Green */}
       <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <CheckCircle2 className="absolute bottom-4 right-4 h-16 w-16 text-white opacity-20" />
          <h4 className="text-sm font-bold opacity-90 mb-1">Đã hoàn thành</h4>
          <div className="text-4xl font-extrabold mb-1">85</div>
          <p className="text-xs opacity-80">Bài tập tổng cộng</p>
       </div>

       {/* Card 3: Purple */}
       <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <Trophy className="absolute bottom-4 right-4 h-16 w-16 text-white opacity-20" />
          <h4 className="text-sm font-bold opacity-90 mb-1">Điểm thưởng</h4>
          <div className="text-4xl font-extrabold mb-1">2,450</div>
          <p className="text-xs opacity-80">XP tích lũy</p>
       </div>
    </div>
  )
}