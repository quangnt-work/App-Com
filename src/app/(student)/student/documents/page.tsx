// src/app/(student)/student/documents/page.tsx
import React from 'react';
import { FolderOpen, FileText, Languages, BookOpen, Headphones, ClipboardCheck, Users, GraduationCap, TableProperties } from 'lucide-react';
import { DocumentCard, type DocumentItem } from '@/components/student/documents/DocumentCard';
import { Pagination } from '@/components/common/Pagination';
import { HeroBanner } from '@/components/common/HeroBanner';

interface DocumentsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const params = await searchParams;
  // Dữ liệu mẫu (Giả định bạn có nhiều hơn 8 tài liệu để test phân trang)
  const allDocuments: DocumentItem[] = [
    { id: '1', title: "Sách giáo khoa tiếng Nga A1", size: "15 MB", type: "PDF Document", icon: <FileText size={24} />, downloadUrl: "#" },
    { id: '2', title: "Từ vựng chuyên ngành", size: "8 MB", type: "PDF Document", icon: <Languages size={24} />, downloadUrl: "#" },
    { id: '3', title: "Ngữ pháp nâng cao", size: "12 MB", type: "PDF Document", icon: <BookOpen size={24} />, downloadUrl: "#" },
    { id: '4', title: "Luyện nghe B1 Audio", size: "45 MB", type: "MP3 Pack", icon: <Headphones size={24} />, downloadUrl: "#" },
    { id: '5', title: "Đề thi mẫu TRKI-1", size: "5 MB", type: "PDF Document", icon: <ClipboardCheck size={24} />, downloadUrl: "#" },
    { id: '6', title: "Sổ tay giao tiếp 365", size: "10 MB", type: "PDF Document", icon: <Users size={24} />, downloadUrl: "#" },
    { id: '7', title: "Giáo trình ĐH Tổng Hợp", size: "22 MB", type: "PDF Document", icon: <GraduationCap size={24} />, downloadUrl: "#" },
    { id: '8', title: "Bảng chia động từ", size: "2 MB", type: "PDF Document", icon: <TableProperties size={24} />, downloadUrl: "#" },
    { id: '9', title: "Bảng biến đổi tính từ", size: "2 MB", type: "PDF Document", icon: <TableProperties size={24} />, downloadUrl: "#" },
    { id: '10', title: "Bảng biến đổi đại từ", size: "2 MB", type: "PDF Document", icon: <TableProperties size={24} />, downloadUrl: "#" },
    { id: '11', title: "Bảng biến đổi danh từ số nhiều", size: "2 MB", type: "PDF Document", icon: <TableProperties size={24} />, downloadUrl: "#" },
  ];

  // Logic cắt dữ liệu cho phân trang
  const ITEMS_PER_PAGE = 8;
  const currentPage = Number(params?.page) || 1;
  const totalPages = Math.ceil(allDocuments.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDocuments = allDocuments.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner TÀI LIỆU - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="KHO TÀI LIỆU TIẾNG NGA"
          ruTitle="МАТЕРИАЛЫ"
          description={allDocuments.length > 0 ? `Tổng hợp ${allDocuments.length} tài liệu giáo trình, từ vựng và bảng tra cứu chuyên sâu` : 'Kho tài liệu phong phú hỗ trợ học tập'}
          icon={FolderOpen}
          gradient="from-teal-600 via-emerald-600 to-teal-700"
        />

        {/* Lưới Thẻ Tài liệu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {currentDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </div>

      {/* Phân trang cố định sát Footer */}
      {totalPages > 1 && (
        <div className="mt-auto pt-3 pb-1 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}