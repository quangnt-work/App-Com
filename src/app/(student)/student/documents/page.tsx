// src/app/(student)/student/documents/page.tsx
import React from 'react';
import { FolderOpen, FileText, Languages, BookOpen, Headphones, ClipboardCheck, Users, GraduationCap, TableProperties } from 'lucide-react';
import { DocumentCard, type DocumentItem } from '@/components/student/documents/DocumentCard';
// Giả định bạn có component Pagination chung
// import { Pagination } from '@/components/ui/Pagination'

export default function DocumentsPage() {
  // Dữ liệu mẫu (Mock data) dựa trên hình ảnh
  const documents: DocumentItem[] = [
    { id: '1', title: "Sách giáo khoa tiếng Nga A1", size: "15 MB", type: "PDF Document", icon: <FileText size={24} />, downloadUrl: "#" },
    { id: '2', title: "Từ vựng chuyên ngành", size: "8 MB", type: "PDF Document", icon: <Languages size={24} />, downloadUrl: "#" },
    { id: '3', title: "Ngữ pháp nâng cao", size: "12 MB", type: "PDF Document", icon: <BookOpen size={24} />, downloadUrl: "#" },
    { id: '4', title: "Luyện nghe B1 Audio", size: "45 MB", type: "MP3 Pack", icon: <Headphones size={24} />, downloadUrl: "#" },
    { id: '5', title: "Đề thi mẫu TRKI-1", size: "5 MB", type: "PDF Document", icon: <ClipboardCheck size={24} />, downloadUrl: "#" },
    { id: '6', title: "Sổ tay giao tiếp 365", size: "10 MB", type: "PDF Document", icon: <Users size={24} />, downloadUrl: "#" },
    { id: '7', title: "Giáo trình ĐH Tổng Hợp", size: "22 MB", type: "PDF Document", icon: <GraduationCap size={24} />, downloadUrl: "#" },
    { id: '8', title: "Bảng chia động từ", size: "2 MB", type: "PDF Document", icon: <TableProperties size={24} />, downloadUrl: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Banner TÀI LIỆU */}
        <div className="bg-[#f07b32] text-white rounded-[2rem] p-10 flex items-center justify-between gap-6 mb-12 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide uppercase mb-3">
              TÀI LIỆU
            </h1>
            <p className="text-white/90 text-sm md:text-base font-medium">
              Kho lưu trữ tài liệu, sách giáo khoa và đề thi tiếng Nga miễn phí cho người Việt.
            </p>
          </div>
          {/* Vòng tròn chứa Icon bên phải */}
          <div className="relative z-10 hidden md:flex items-center justify-center w-28 h-28 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm">
             <FolderOpen size={48} strokeWidth={2.5} />
          </div>
        </div>

        {/* Lưới Thẻ Tài liệu (4 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
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