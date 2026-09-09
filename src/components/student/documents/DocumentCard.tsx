// src/components/student/documents/DocumentCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { Download } from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  size: string;
  type: string;
  icon: ReactNode;
  downloadUrl: string;
}

interface DocumentCardProps {
  document: DocumentItem;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col shadow-sm border border-slate-200/80 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Icon ở góc trái */}
      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100/80 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
        {document.icon}
      </div>

      {/* Thông tin tài liệu */}
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 text-[17px] mb-2 line-clamp-2">
          {document.title}
        </h3>
        <p className="text-slate-500 text-sm flex items-center gap-2 mb-6">
          <span className="bg-slate-100 p-1 rounded text-slate-400">
             <Download size={12} />
          </span>
          {document.size} • {document.type}
        </p>
      </div>

      {/* Nút Tải về */}
      <Link 
        href={document.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 transition-all mt-auto"
      >
        <Download size={16} strokeWidth={2.5} />
        Tải về
      </Link>
    </div>
  );
}