// src/app/(student)/student/ai/speaking/[topicSlug]/page.tsx

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  List, 
  MessageSquare, 
  Users, 
  Heart, 
  Clock, 
  Home, 
  Utensils, 
  Sun, 
  Shirt, 
  Car, 
  ChevronRight,
  LucideIcon // Import thêm type LucideIcon
} from 'lucide-react';

// Định nghĩa Interface rõ ràng cho mỗi chủ đề
interface TopicInfo {
  title: string;
  icon: LucideIcon; // Thay thế 'any' bằng LucideIcon
}

// Định nghĩa kiểu dữ liệu cho toàn bộ cấu hình, quy định key là chuỗi và value là TopicInfo
const topicConfig: Record<string, TopicInfo> = {
  'greeting': { title: "Chào hỏi & Giới thiệu", icon: Users },
  'family': { title: "Gia đình & Bạn bè", icon: Heart },
  'numbers-time': { title: "Số, Thời gian & Ngày", icon: Clock },
  'house': { title: "Nhà cửa & Đồ đạc", icon: Home },
  'food': { title: "Thức ăn & Đồ uống", icon: Utensils },
  'daily-routine': { title: "Sinh hoạt hàng ngày", icon: Sun },
  'clothes': { title: "Quần áo & Màu sắc", icon: Shirt },
  'transport': { title: "Phương tiện & Đi lại", icon: Car },
};

export default async function PracticeSelectionPage({ 
  params 
}: { 
  params: Promise<{ topicSlug: string }> 
}) {
  const resolvedParams = await params;
  const topicSlug = resolvedParams.topicSlug;

  const currentTopic = topicConfig[topicSlug];

  if (!currentTopic) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Chủ đề không tồn tại.</p>
        <Link href="/student/ai/speaking" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // TypeScript giờ đã biết chính xác TopicIcon là một React Component từ lucide-react
  const TopicIcon = currentTopic.icon;

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-20">
      <div className="container mx-auto px-4 pt-10 max-w-[800px]">

        {/* Header Chủ đề */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
            <TopicIcon size={44} className="text-[#3b82f6]" strokeWidth={2.5} />
          </div>
          <h1 className="text-[32px] font-bold text-slate-900 mb-3">
            {currentTopic.title}
          </h1>
          <p className="text-slate-500 text-[17px]">
            Bạn muốn luyện tập phần nào trước?
          </p>
        </div>

        {/* Các Card Lựa chọn */}
        <div className="space-y-5 max-w-[550px] mx-auto">
          
          {/* Luyện Từ Vựng */}
          <Link href={`/student/ai/speaking/${topicSlug}/vocabulary`} className="block">
            <div className="group flex items-center p-4 bg-white border border-[#3b82f6] rounded-[24px] hover:shadow-md transition-all cursor-pointer">
              <div className="w-[60px] h-[60px] bg-[#3b82f6] rounded-[18px] flex items-center justify-center mr-5 shrink-0">
                <List size={30} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-[19px] font-bold text-slate-900 mb-0.5">Luyện Từ Vựng</h3>
                <p className="text-slate-400 text-[15px]">20+ từ đơn lẻ theo chủ đề</p>
              </div>
              <ChevronRight size={26} className="text-slate-300 group-hover:text-[#3b82f6] transition-colors mr-2" />
            </div>
          </Link>

          {/* Luyện Mẫu Câu */}
          <Link href={`/student/ai/speaking/${topicSlug}/sentences`} className="block">
            <div className="group flex items-center p-4 bg-white border border-[#3b82f6] rounded-[24px] hover:shadow-md transition-all cursor-pointer">
              <div className="w-[60px] h-[60px] bg-[#bbf7d0] rounded-[18px] flex items-center justify-center mr-5 shrink-0">
                <MessageSquare size={30} className="text-[#166534] fill-[#166534]/20" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-[19px] font-bold text-slate-900 mb-0.5">Luyện Mẫu Câu</h3>
                <p className="text-slate-500 text-[15px]">20+ hội thoại ngắn & câu thông dụng</p>
              </div>
              <ChevronRight size={26} className="text-slate-300 group-hover:text-[#22c55e] transition-colors mr-2" />
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}