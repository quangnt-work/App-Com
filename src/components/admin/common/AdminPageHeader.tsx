// src/components/admin/common/AdminPageHeader.tsx
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href: string; // Bắt buộc dùng Link cho action chính để tối ưu SEO/UX
    icon?: LucideIcon;
  };
}

export function AdminPageHeader({ title, description, icon: Icon, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-sky-500" />}
          {title}
        </h1>
        {description && <p className="text-slate-500 mt-1 text-sm">{description}</p>}
      </div>
      
      {action && (
        <Link href={action.href}>
          <Button className="bg-sky-600 hover:bg-sky-700 shadow-sm text-white">
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}