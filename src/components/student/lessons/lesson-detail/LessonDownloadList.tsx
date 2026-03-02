// src/components/student/lessons/lesson-detail/LessonDownloadList.tsx
import { FileText, Download } from "lucide-react";
import { Lesson } from "@/types/lesson";

export function LessonDownloadList({ lesson }: { lesson: Lesson }) {
  // Giả sử có một mảng tài liệu đi kèm. Ở đây mình mock dựa theo ảnh.
  const documents = [
    { name: "Bang_tra_cuu_giong.pdf", url: "#" },
    { name: "Bai_tap_tu_vung.docx", url: "#" },
  ];

  if (!documents.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-center gap-2">
        <FileText size={18} className="text-blue-600" />
        <h3 className="font-bold text-blue-700 text-sm tracking-wide">TÀI LIỆU KÈM THEO</h3>
      </div>
      
      <div className="p-2 flex flex-col">
        {documents.map((doc, idx) => (
          <a 
            key={idx}
            href={doc.url}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 truncate mr-3">
              {doc.name}
            </span>
            <Download size={14} className="text-gray-400 group-hover:text-blue-600 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}