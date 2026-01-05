// src/components/admin/practice/PracticeItem.tsx
import React from 'react'
import { PracticeSet } from '@/types/practice-admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, MoreVertical, Eye, BarChart2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PracticeItemProps {
  item: PracticeSet;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PracticeItem({ item, onEdit, onDelete }: PracticeItemProps) {
  
  // Helper render badge skill
  const getSkillBadge = (skill: string) => {
    const styles: Record<string, string> = {
      reading: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      listening: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      writing: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      speaking: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      grammar: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      vocabulary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    };
    return <Badge className={`${styles[skill] || styles.vocabulary} border-none`}>{skill.toUpperCase()}</Badge>;
  };

  return (
    <div className="group bg-white rounded-lg border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all">
      {/* 1. Thumbnail / Icon */}
      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
        {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
            <span className="text-2xl">📝</span>
        )}
      </div>

      {/* 2. Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {getSkillBadge(item.skill)}
          <Badge variant="outline" className="text-xs font-bold text-slate-600">{item.level}</Badge>
          {!item.is_published && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-500">Draft</Badge>
          )}
        </div>
        <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-sky-600 transition-colors cursor-pointer" onClick={() => onEdit(item.id)}>
            {item.title}
        </h4>
        <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
            <span>{item.total_questions} câu hỏi</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Cập nhật: {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* 3. Stats (Optional) */}
      <div className="hidden md:flex flex-col items-end gap-1 px-4 border-l border-slate-100">
         <div className="text-sm font-medium text-slate-700">{item.stats?.participants || 0} học viên</div>
         <div className="text-xs text-slate-400">đã tham gia</div>
      </div>

      {/* 4. Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center ml-auto sm:ml-0">
        <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="text-slate-400 hover:text-blue-600">
            <Edit className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item.id)}>
                <Eye className="w-4 h-4 mr-2" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
                <BarChart2 className="w-4 h-4 mr-2" /> Thống kê
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Xóa bộ đề
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}