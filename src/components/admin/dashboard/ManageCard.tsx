import { Card } from '../../ui/card'
import { type LucideIcon } from 'lucide-react' // Import Type chuẩn

// Định nghĩa Interface rõ ràng
interface ManageCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick?: () => void; // Thêm onClick nếu cần bắt sự kiện sau này
}

export function ManageCard({ icon: Icon, title, desc, onClick }: ManageCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-4 bg-white border-slate-200"
    >
       <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
         <Icon className="h-6 w-6" />
       </div>
       <div>
         <h3 className="font-bold text-lg text-slate-900">{title}</h3>
         <p className="text-slate-500 text-sm">{desc}</p>
       </div>
    </Card>
  )
}