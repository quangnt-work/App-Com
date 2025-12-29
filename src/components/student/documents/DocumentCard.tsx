import { Download, FileText, FileSpreadsheet, FileVideo, FileCode, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type DocumentItem, type FileConfig, type FileType } from '@/types/document'

// Helper function để lấy màu và icon theo loại file
const getFileConfig = (type: FileType): FileConfig => {
  switch (type) {
    case 'PDF':
      return { icon: FileText, color: 'text-red-500', bgColor: 'bg-red-50', label: 'PDF' };
    case 'DOCX':
      return { icon: FileCode, color: 'text-blue-500', bgColor: 'bg-blue-50', label: 'DOCX' };
    case 'PPTX':
      return { icon: Presentation, color: 'text-orange-500', bgColor: 'bg-orange-50', label: 'PPTX' };
    case 'XLSX':
      return { icon: FileSpreadsheet, color: 'text-emerald-500', bgColor: 'bg-emerald-50', label: 'XLSX' };
    case 'MP4':
      return { icon: FileVideo, color: 'text-purple-500', bgColor: 'bg-purple-50', label: 'VIDEO' };
    default:
      return { icon: FileText, color: 'text-slate-500', bgColor: 'bg-slate-50', label: 'FILE' };
  }
}

export function DocumentCard({ doc }: { doc: DocumentItem }) {
  const config = getFileConfig(doc.file_type);
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      {/* Header: Icon & Subject */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
           <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">
          {doc.subject}
        </span>
      </div>

      {/* Body: Title & Desc */}
      <div className="flex-1 mb-6">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-sky-500 transition-colors">
          {doc.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3">
          {doc.description}
        </p>
      </div>

      {/* Footer: Meta & Download */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
        <div className="flex flex-col">
           <span className="text-xs font-bold text-slate-400 uppercase">{config.label} • {doc.file_size}</span>
           <span className="text-[10px] text-slate-400">{doc.created_at}</span>
        </div>
        
        <Button size="icon" variant="ghost" className="rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}