import { Headphones, Download } from "lucide-react";
import { Lesson } from "@/types/lesson";

export function LessonDocuments({ lesson }: { lesson: Lesson }) {
  const availableFiles = [];

  // Chỉ gom file Audio (Bỏ qua file_url chứa PDF/PPTX)
  if (lesson.audio_url) {
    availableFiles.push({
      id: 'audio_file',
      title: "File Audio (Listening)",
      subtitle: "Tài liệu âm thanh",
      url: lesson.audio_url,
      type: 'audio',
      icon: <Headphones size={24} />
    });
  }

  // Nếu không có file audio nào
  if (availableFiles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm text-slate-500 italic">
        Không có file âm thanh đính kèm nào cho bài học này.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {availableFiles.map((file) => (
        <div key={file.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg shrink-0">
              {file.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 line-clamp-2">{file.title}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{file.subtitle}</p>
            </div>
          </div>
          
          {/* Trình phát audio */}
          {file.type === 'audio' && (
            <audio controls className="w-full h-10 mt-2">
              <source src={file.url} />
            </audio>
          )}

          {/* Nút tải xuống */}
          <div className="mt-auto pt-4">
            <a 
              href={file.url} 
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#F8F9FA] hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium text-sm rounded-lg transition-colors border border-slate-200"
            >
              <Download size={16} />
              Tải âm thanh xuống
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}