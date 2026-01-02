import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  subValue?: React.ReactNode;
  progress?: number; // Optional cho thanh tiến trình
}

export function StatCard({ icon: Icon, iconColor, iconBg, label, value, subValue, progress }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
      </div>
      
      {/* Hiển thị Progress bar nếu có */}
      {progress !== undefined ? (
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 font-medium">
          {subValue}
        </div>
      )}
    </div>
  )
}