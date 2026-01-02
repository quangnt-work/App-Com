'use client'

import React, { useState } from 'react'
import { FileText, FileSpreadsheet, FileCode, Presentation, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { DocumentItem } from '@/types/document'

// --- HELPER CONFIG ---
const getFileConfig = (type: string) => {
  switch (type) {
    case 'PDF': return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' };
    case 'DOCX': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' };
    case 'XLSX': return { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' };
    case 'PPTX': return { icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' };
    default: return { icon: FileCode, color: 'text-slate-500', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-700' };
  }
}

const getCourseBadgeColor = (courseName: string) => {
    if(courseName.includes('React')) return 'bg-blue-100 text-blue-700';
    if(courseName.includes('Python')) return 'bg-yellow-100 text-yellow-700';
    if(courseName.includes('UI/UX')) return 'bg-purple-100 text-purple-700';
    return 'bg-slate-100 text-slate-700';
}

// --- MAIN COMPONENT ---
export function DocumentTable({ documents }: { documents: DocumentItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Logic tính toán phân trang
  const totalItems = documents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  // 2. Xử lý trường hợp KHÔNG CÓ DỮ LIỆU
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Chưa có tài liệu nào</h3>
        <p className="text-slate-500 max-w-sm mt-1">
          Hiện tại chưa có tài liệu nào được tải lên hệ thống. Hãy bắt đầu bằng cách tải lên tài liệu đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300 cursor-pointer" /></th>
              <th className="p-4">Tên tài liệu</th>
              <th className="p-4">Định dạng</th>
              <th className="p-4">Kích thước</th>
              <th className="p-4">Ngày tải lên</th>
              <th className="p-4">Khóa học</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {currentDocuments.map((doc) => {
              const config = getFileConfig(doc.file_type)
              const Icon = config.icon
              
              return (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4"><input type="checkbox" className="rounded border-slate-300 cursor-pointer" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="max-w-[200px] xl:max-w-xs">
                        <p className="font-bold text-slate-900 truncate" title={doc.title}>{doc.title}</p>
                        <p className="text-xs text-slate-500 truncate">Tải lên bởi: {doc.uploader_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${config.badge}`}>
                      {doc.file_type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs">{doc.file_size}</td>
                  <td className="p-4 text-slate-600">{doc.created_at}</td>
                  <td className="p-4">
                      <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold w-fit ${getCourseBadgeColor(doc.course_name)}`}>
                          <span className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center text-[10px]">
                              {doc.course_name.charAt(0)}
                          </span>
                          <span className="truncate max-w-[120px]">{doc.course_name}</span>
                      </span>
                  </td>
                  <td className="p-4 text-right">
                     <button className="text-slate-400 hover:text-sky-600 font-bold text-xs transition-colors">Chi tiết</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* 3. PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <p className="text-xs text-slate-500 order-2 sm:order-1">
              Hiển thị <span className="font-bold text-slate-900">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> trong số <span className="font-bold text-slate-900">{totalItems}</span> tài liệu
            </p>
            
            <div className="flex gap-2 order-1 sm:order-2">
                <button 
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Render số trang */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                   // Logic rút gọn số trang nếu quá nhiều (chỉ hiện trang đầu, cuối và lân cận)
                   if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                      if (Math.abs(page - currentPage) === 3) return <span key={page} className="px-1 text-slate-400">...</span>;
                      return null;
                   }

                   return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                          currentPage === page 
                            ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                   );
                })}

                <button 
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  )
}