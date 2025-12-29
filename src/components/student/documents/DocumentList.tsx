import { DocumentCard } from './DocumentCard'
import { type DocumentItem } from '@/types/document'
import { Inbox, FileX } from 'lucide-react'

// Định nghĩa Props rõ ràng
interface DocumentListProps {
  documents: DocumentItem[];
  title?: string;
  className?: string;
}

export function DocumentList({ documents, title, className }: DocumentListProps) {
  // 1. Trường hợp không có dữ liệu (Empty State)
  if (!documents || documents.length === 0) {
    return (
      <div className="w-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <FileX className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Không tìm thấy tài liệu</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
          Rất tiếc, chúng tôi không tìm thấy tài liệu nào phù hợp với yêu cầu của bạn.
        </p>
      </div>
    )
  }

  // 2. Trường hợp có dữ liệu -> Render Grid
  return (
    <div className={`mb-12 ${className}`}>
      {/* Tiêu đề section (nếu có) */}
      {title && (
         <h3 className="font-bold text-slate-800 mb-6 text-lg">
           {title}
         </h3>
      )}

      {/* Grid Layout Responsive: Mobile 1 cột -> Tablet 2 cột -> PC 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  )
}