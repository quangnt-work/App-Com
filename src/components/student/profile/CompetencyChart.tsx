import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'

export function CompetencyChart() {
  return (
    <Card className="p-6 bg-white shadow-sm border-slate-200 rounded-2xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900">
            📊 Biểu đồ năng lực
          </h3>
          <p className="text-slate-500 text-sm mt-1">Sự tiến bộ qua các bài kiểm tra gần đây</p>
        </div>
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">6 tháng qua</Badge>
      </div>
      <div className="h-72 flex items-end justify-between px-4 gap-4">
        {[50, 60, 55, 70, 75, 65, 90].map((h, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-2 group relative">
            {i === 6 && <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md mb-1 relative top-0 group-hover:-top-1 transition-all">8.5</div>}
            <div className={`w-full rounded-t-xl relative transition-all ${i === 6 ? 'bg-sky-500 hover:bg-sky-600' : 'bg-sky-100 hover:bg-sky-200'}`} style={{ height: `${h}%` }} />
            <span className="text-xs text-slate-500 font-medium">Thg {i + 5}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}