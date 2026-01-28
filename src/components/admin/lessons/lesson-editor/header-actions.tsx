// components/lessons/header-actions.tsx
import Link from 'next/link';
import { ArrowLeft, ChevronRight, LayoutGrid, Save } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Giả sử bạn đã có component Button

interface HeaderActionsProps {
  title: string;
  isEditing: boolean;
  onSave: () => void;
}

export default function HeaderActions({ title, isEditing, onSave }: HeaderActionsProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: Breadcrumbs & Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/lessons" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex flex-col">
            <nav className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
              <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                <LayoutGrid className="w-3 h-3" /> Dashboard
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="hover:text-blue-600 cursor-pointer">Quản lý bài học</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-800 font-medium">
                {isEditing ? 'Chỉnh sửa' : 'Tạo mới'}
              </span>
            </nav>
            
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-md">
              {title || (isEditing ? 'Đang tải tiêu đề...' : 'Tạo bài học mới')}
            </h1>
          </div>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
              Trạng thái: {isEditing ? 'Đang cập nhật' : 'Bản nháp'}
           </div>
           
           <Button 
            onClick={onSave} 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
           >
             <Save className="w-4 h-4" /> 
             {isEditing ? 'Cập nhật' : 'Xuất bản ngay'}
           </Button>
        </div>
      </div>
    </header>
  );
}