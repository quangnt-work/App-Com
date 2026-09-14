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
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 flex flex-col shadow-xs border border-slate-200/80 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1.5 transition-all duration-300 h-full relative">
      {/* Icon ở góc trái */}
      <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3.5 shadow-2xs">
        {document.icon}
      </div>

      {/* Thông tin tài liệu */}
      <div className="flex-1 mb-3">
        <h3 className="font-extrabold text-slate-900 text-base mb-1.5 line-clamp-2 leading-snug">
          {document.title}
        </h3>
        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-2 font-medium">
          <span className="bg-slate-100 p-1 rounded text-slate-500">
             <Download size={11} />
          </span>
          <span>{document.size} • {document.type}</span>
        </p>
      </div>

      {/* Nút Tải về */}
      <Link 
        href={document.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-10 flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs shadow-emerald-500/20 hover:shadow-md transition-all mt-auto"
      >
        <Download size={13} strokeWidth={2.5} />
        <span>Tải về</span>
      </Link>
    </div>
  );
}