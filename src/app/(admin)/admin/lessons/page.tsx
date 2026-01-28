import { Suspense } from "react";
import LessonHeader from "@/components/admin/lessons/LessonHeader";
import LessonFilters from "@/components/admin/lessons/LessonFilters";
import LessonTable from "@/components/admin/lessons/LessonTable";
import { getLessons } from "@/actions/lesson-actions";
import { Skeleton } from "@/components/ui/skeleton";


export const metadata = {
  title: "Quản lý bài học | Admin Dashboard",
};


export default async function LessonsPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string; category?: string };
}) {
  // 1. Lấy params từ URL
  const query = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  const category = searchParams?.category || "";
 
  // 2. Gọi Server Action lấy dữ liệu
  // Lưu ý: getLessons trong file actions trả về { data, count, error }
  const { data, count, error } = await getLessons(page, 10, query, category);


  if (error) {
    return <div className="text-red-500 p-4">Lỗi tải dữ liệu: {error}</div>;
  }


  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      <LessonHeader />
     
      <LessonFilters />


      <Suspense fallback={<TableSkeleton />}>
        <LessonTable data={data || []} />
       
        {/* Phân trang đơn giản (Bạn có thể tách thành component Pagination riêng) */}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <p>Hiển thị {(data || []).length} trên tổng số {count} bài học</p>
          {/* Logic phân trang chi tiết có thể thêm sau */}
        </div>
      </Suspense>
    </div>
  );
}


// Skeleton loading cho bảng
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[60px] w-full rounded-xl" />
      <Skeleton className="h-[60px] w-full rounded-xl" />
      <Skeleton className="h-[60px] w-full rounded-xl" />
    </div>
  );
}
