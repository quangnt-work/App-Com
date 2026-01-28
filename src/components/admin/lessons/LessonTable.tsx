import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText, Video, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteLessonButton from "./DeleteLessonButton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";


// Định nghĩa Type dựa trên DB schema của bạn
type Lesson = {
  id: string;
  title: string;
  category: string | null;
  status: string | null; // published, draft...
  thumbnail: string | null;
  created_at: string | null;
  type: string | null; // video, text...
};


export default function LessonTable({ data }: { data: Lesson[] }) {
  // Helper render icon loại bài học
  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case 'video': return <Video className="w-3 h-3 text-blue-500" />;
      case 'text': return <FileText className="w-3 h-3 text-orange-500" />;
      default: return <ListFilter className="w-3 h-3 text-slate-500" />;
    }
  };


  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="py-4 px-6">Bài học</th>
              <th className="py-4 px-6">Danh mục</th>
              <th className="py-4 px-6">Loại</th>
              <th className="py-4 px-6">Ngày tạo</th>
              <th className="py-4 px-6 text-center">Trạng thái</th>
              <th className="py-4 px-6 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* Cột Bài Học */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {lesson.thumbnail ? (
                        <Image src={lesson.thumbnail} alt={lesson.title} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400">
                          <FileText size={20} />
                        </div>
                      )}
                    </div>
                    <div className="max-w-[200px] md:max-w-xs">
                      <p className="font-semibold text-slate-900 truncate" title={lesson.title}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500">ID: {lesson.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>


                {/* Cột Danh Mục */}
                <td className="py-4 px-6">
                  <Badge variant="outline" className="font-normal text-slate-600 bg-slate-100 border-slate-200">
                    {lesson.category || "Chưa phân loại"}
                  </Badge>
                </td>
               
                 {/* Cột Loại */}
                <td className="py-4 px-6">
                   <div className="flex items-center gap-2 capitalize text-slate-600">
                      {getTypeIcon(lesson.type)}
                      {lesson.type || 'text'}
                   </div>
                </td>


                {/* Cột Ngày Tạo */}
                <td className="py-4 px-6 text-slate-600">
                  {lesson.created_at
                    ? format(new Date(lesson.created_at), "dd/MM/yyyy", { locale: vi })
                    : "-"}
                </td>


                {/* Cột Trạng Thái */}
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    lesson.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      lesson.status === "published" ? "bg-emerald-500" : "bg-slate-400"
                    }`} />
                    {lesson.status === "published" ? "Công khai" : "Nháp"}
                  </span>
                </td>


                {/* Cột Hành Động */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Link href={`/lessons/${lesson.id}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/lessons/edit/${lesson.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteLessonButton id={lesson.id} title={lesson.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Không có bài học.
          </div>
        )}
      </div>
    </div>
  );
}
