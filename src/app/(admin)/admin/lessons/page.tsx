import { getLessons } from "@/actions/lesson-actions";
import LessonTable from "@/components/admin/lessons/LessonTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function LessonsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 10;

  const { data, count, error } = await getLessons(page, pageSize, params.query, params.category);

  if (error) return <div className="p-6 text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8 font-sans text-slate-900 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold">Quản lý bài học</h1>
           <p className="text-gray-500">Quản lý tất cả bài học và tài liệu lẻ tại đây.</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button className="bg-sky-600 text-white gap-2">
            <Plus size={18} /> Tạo bài học mới
          </Button>
        </Link>
      </div>
      
      <LessonTable
        lessons={data || []}
        total={count || 0}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  );
}