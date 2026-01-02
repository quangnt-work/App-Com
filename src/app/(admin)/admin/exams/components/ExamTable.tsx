'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, ChevronLeft, ChevronRight, Inbox, Eye, Loader2 } from 'lucide-react'
import { ExamItem, ExamLevel, ExamStatus } from '@/types/exam-admin'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

// Import Modal Xem trước (Tái sử dụng từ phần Editor)
// Lưu ý: Đảm bảo đường dẫn import đúng nơi bạn đặt file ExamPreviewModal
import { ExamPreviewModal } from '@/components/admin/exams/ExamPreviewModal'

// --- HELPERS (Giữ nguyên logic Badge cũ) ---
const getLevelBadge = (level: ExamLevel) => {
  switch (level) {
    case 'easy': 
      return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold border border-emerald-200">Dễ</span>;
    case 'medium': 
      return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-bold border border-blue-200">Trung bình</span>;
    case 'hard': 
      return <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded text-xs font-bold border border-rose-200">Khó</span>;
    default: return null;
  }
}

const getStatusBadge = (status: ExamStatus) => {
  switch (status) {
    case 'published':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Công khai</span>;
    case 'draft':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Nháp</span>;
    case 'hidden':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Đang ẩn</span>;
  }
}

// --- MAIN COMPONENT ---
export function ExamTable({ exams }: { exams: ExamItem[] }) {
  const supabase = createClient()
  
  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State Xem chi tiết (Preview)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null) // Lưu ID đang load để hiện spinner
  const [previewData, setPreviewData] = useState<{ exam: any, questions: any[] } | null>(null)

  // Logic Phân trang
  const totalItems = exams.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  // --- HÀM XỬ LÝ XEM CHI TIẾT ---
  const handleViewDetails = async (examId: string) => {
    setLoadingId(examId) // Bật loading cho dòng tương ứng
    try {
        // 1. Fetch thông tin chi tiết Exam (để lấy description, total_score...)
        const { data: examData, error: examError } = await supabase
            .from('exams')
            .select('*')
            .eq('id', examId)
            .single()
        
        if (examError) throw examError

        // 2. Fetch danh sách câu hỏi
        const { data: questionData, error: qError } = await supabase
            .from('exam_questions')
            .select('*')
            .eq('exam_id', examId)
            .order('order_index', { ascending: true })

        if (qError) throw qError

        // 3. Set dữ liệu và mở Modal
        setPreviewData({
            exam: examData,
            questions: questionData || []
        })
        setIsPreviewOpen(true)

    } catch (error: any) {
        console.error(error)
        toast.error("Không thể tải nội dung đề thi")
    } finally {
        setLoadingId(null) // Tắt loading
    }
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Chưa có đề thi nào</h3>
        <p className="text-slate-500 text-sm mt-1">Hãy tạo đề thi mới để bắt đầu quản lý.</p>
      </div>
    );
  }

  return (
    <>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="p-4">Tên đề thi</th>
                <th className="p-4">Môn học</th>
                <th className="p-4">Cấp độ</th>
                <th className="p-4 text-center">Thời gian</th>
                <th className="p-4 text-center">Câu hỏi</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
                {currentExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="p-4">
                    <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-1" title={exam.title}>{exam.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Mã: <span className="font-mono text-sky-600">{exam.code}</span></p>
                    </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{exam.subject}</td>
                    <td className="p-4">{getLevelBadge(exam.level)}</td>
                    <td className="p-4 text-center text-slate-600 font-medium">{exam.duration} phút</td>
                    <td className="p-4 text-center text-slate-600 font-bold">{exam.question_count}</td>
                    <td className="p-4">{getStatusBadge(exam.status)}</td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                            
                            {/* BUTTON XEM CHI TIẾT (MỚI) */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleViewDetails(exam.id)}
                                disabled={loadingId === exam.id}
                                className="h-8 w-8 text-slate-400 hover:text-purple-600 hover:bg-purple-50"
                                title="Xem nội dung chi tiết"
                            >
                                {loadingId === exam.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>

                            {/* Link Sửa */}
                            <Link href={`/admin/exams/${exam.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50" title="Chỉnh sửa">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </Link>

                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" title="Xóa">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
             <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                <p className="text-xs text-slate-500 order-2 sm:order-1">
                    Hiển thị <span className="font-bold text-slate-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> / <span className="font-bold text-slate-900">{totalItems}</span>
                </p>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => goToPage(page)} className={`h-8 w-8 rounded-md text-xs font-bold ${currentPage === page ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{page}</button>
                    ))}
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>
        )}
        </div>

        {/* MODAL XEM CHI TIẾT (Popup) */}
        {previewData && (
            <ExamPreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                exam={previewData.exam} 
                questions={previewData.questions} 
            />
        )}
    </>
  )
}