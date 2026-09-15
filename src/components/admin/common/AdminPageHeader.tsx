// src/components/admin/common/AdminPageHeader.tsx
import React from 'react';
import Link from 'next/link';
import { LucideIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  bannerColor?: string;
}

export function AdminPageHeader({
  title,
  subtitle,
  icon: MainIcon,
  badgeText,
  badgeIcon: BadgeIcon,
  action,
  bannerColor = 'bg-[#f97316]'
}: AdminPageHeaderProps) {
  return (
    <div>
      {/* Banner */}
      <div className={`${bannerColor} rounded-2xl p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md`}>
        <div className="flex items-center gap-4">
          <MainIcon size={40} className="opacity-90 shrink-0" />
          <h1 className="text-3xl font-bold tracking-wide uppercase">{title}</h1>
        </div>
        {(badgeText || subtitle) && (
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-orange-100 flex-col md:flex-row md:items-center">
            <span className="text-sm font-medium">{badgeText || subtitle}</span>
            {BadgeIcon && <BadgeIcon size={20} />}
          </div>
        )}
      </div>

      {/* Action Button */}
      {action && (
        <div className="flex items-center gap-3">
          <Link href={action.href}>
            <Button className={`${bannerColor} hover:brightness-90 text-white shadow-sm font-medium rounded-lg px-6 h-11 transition-all`}>
              {action.icon ? <action.icon className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {action.label}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;