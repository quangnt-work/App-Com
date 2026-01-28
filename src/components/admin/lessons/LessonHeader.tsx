import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LessonHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý bài học</h1>
        <p className="text-slate-500 text-sm mt-1">
          Tạo và quản lý các nội dung học tập trên hệ thống.
        </p>
      </div>
      <Link href="/admin/lessons/create">
        <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-200">
          <Plus className="w-4 h-4 mr-2" />
          Thêm bài học
        </Button>
      </Link>
    </div>
  );
}