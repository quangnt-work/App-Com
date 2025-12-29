import Link from 'next/link' // 1. Import Link
import { Card } from '../../ui/card' // (Hoặc '@/components/ui/card' tùy cấu hình path của bạn)
import { type LucideIcon } from 'lucide-react'

interface ManageCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick?: () => void;
  href?: string; // 2. Thêm prop href tùy chọn
}

export function ManageCard({ icon: Icon, title, desc, onClick, href }: ManageCardProps) {
  // Tạo nội dung Card tách biệt để tái sử dụng
  const CardContent = (
    <Card 
      onClick={onClick}
      className="p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-4 bg-white border-slate-200 h-full"
    >
       <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
         <Icon className="h-6 w-6" />
       </div>
       <div>
         <h3 className="font-bold text-lg text-slate-900">{title}</h3>
         <p className="text-slate-500 text-sm">{desc}</p>
       </div>
    </Card>
  );

  // 3. Logic: Nếu có href thì bọc bằng Link, nếu không thì trả về Card thường
  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}