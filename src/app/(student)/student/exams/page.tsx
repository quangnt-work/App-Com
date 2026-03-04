// src/app/(student)/student/exams/page.tsx
import React from 'react';
import { FileText, BookOpen, Headphones, ListChecks, Activity, Component } from 'lucide-react';
import { ExamCard, type ExamItem } from '@/components/student/exams/ExamCard';
import { HeroBanner } from '@/components/common/HeroBanner';

export default function ExamsPage() {
  // Dữ liệu mẫu (Mock data)
  const exams: ExamItem[] = [
    { id: '1', title: "Bài kiểm tra 1: Ngữ pháp cơ bản", category: "SƠ CẤP A1", duration: "20 phút", questionsCount: "15 câu hỏi", icon: <FileText size={24} />, href: "#" },
    { id: '2', title: "Bài kiểm tra 2: Từ vựng thông dụng", category: "TỪ VỰNG", duration: "15 phút", questionsCount: "10 câu hỏi", icon: <BookOpen size={24} />, href: "#" },
    { id: '3', title: "Bài kiểm tra 3: Kỹ năng nghe hiểu", category: "KỸ NĂNG NGHE", duration: "30 phút", questionsCount: "20 câu hỏi", icon: <Headphones size={24} />, href: "#" },
    { id: '4', title: "Bài kiểm tra 4: Cấu trúc câu", category: "CẤU TRÚC", duration: "20 phút", questionsCount: "15 câu hỏi", icon: <ListChecks size={24} />, href: "#" },
    { id: '5', title: "Bài kiểm tra 5: Tiền tố động từ", category: "ĐỘNG TỪ", duration: "18 phút", questionsCount: "12 câu hỏi", icon: <Activity size={24} />, href: "#" },
    { id: '6', title: "Bài kiểm tra 6: Danh từ cách 2", category: "DANH TỪ", duration: "20 phút", questionsCount: "15 câu hỏi", icon: <Component size={24} />, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Banner KIỂM TRA */}
        <HeroBanner 
          title="KIỂM TRA"
          description="Đánh giá năng lực tiếng Nga của bạn thông qua các bài kiểm tra đa dạng."
          icon={FileText}
        />

        {/* Lưới Thẻ Bài Kiểm Tra (3 cột theo thiết kế) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        {/* Phân trang (Mockup theo ảnh) */}
         <div className="mt-16 flex justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
              <span className="sr-only">Trang trước</span>
              &lt;
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f07b32] text-white font-bold shadow-sm">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">3</button>
            <span className="flex items-center justify-center px-2 text-gray-400">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-medium">10</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
              <span className="sr-only">Trang sau</span>
              &gt;
            </button>
         </div>

      </main>
    </div>
  );
}