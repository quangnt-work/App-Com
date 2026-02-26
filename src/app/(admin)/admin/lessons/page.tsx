import LessonHeader from "@/components/admin/lessons/LessonHeader";
import LessonFilters from "@/components/admin/lessons/LessonFilter";
import LessonTable from "@/components/admin/lessons/LessonTable";
import { getLessons } from "@/actions/lesson-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonPagination } from "@/components/admin/lessons/lesson-pagination";

interface LessonsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
  }>;
}

export const metadata = {
  title: "Quản lý bài học | Admin Dashboard",
};


export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const params = await searchParams;
  // 1. Lấy params từ URL
  const currentPage = Number(params.page) || 1;
  const pageSize = 10; // Bạn có thể cấu hình số lượng item mỗi trang tại đây
  const searchQuery = params.q || "";
  const categoryFilter = params.category || undefined;
 
  // 2. Gọi Server Action lấy dữ liệu
  // Lưu ý: getLessons trong file actions trả về { data, count, error }
  const { data: lessons, count, error } = await getLessons(
    currentPage,
    pageSize,
    searchQuery,
    categoryFilter
  );


  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md m-6 border border-red-200">
        <h3 className="font-bold">Đã xảy ra lỗi</h3>
        <p>Không thể tải dữ liệu: {error}</p>
      </div>
    );
  }

  const currentData = lessons || [];
  const totalItems = count || 0;

  const formattedData = currentData.map((lesson) => ({
    ...lesson,

    thumbnail: lesson.thumbnail ?? null,
    // 1. Ép kiểu type cho chuẩn với LessonType
    type: lesson.type as 'text' | 'file' | 'video' | 'audio' | 'quiz',
    
    // 2. Ép kiểu status cho chuẩn với LessonStatus
    status: (lesson.status || 'draft') as 'draft' | 'published' | 'archived',
    
    // 3. Category trong Interface của bạn bắt buộc là 'string' (không được null)
    // Nên nếu Supabase trả về null, ta cho nó thành chuỗi rỗng '' hoặc 'Chưa phân loại'
    category: lesson.category || '',
  }));


  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      <LessonHeader />
     
      <LessonFilters />

      <div className="rounded-md border bg-white shadow-sm">
        <LessonTable data={formattedData} />
      </div>
      
      {/* Footer & Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <p>Hiển thị {(lessons || []).length} trên tổng số {count} bài học</p>
        <LessonPagination 
            currentPage={currentPage}
            totalItems={totalItems} // Tổng số bản ghi trong database
            pageSize={pageSize}
        />
        </div>
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