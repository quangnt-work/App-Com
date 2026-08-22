// src/app/(admin)/admin/exams/page.tsx
import ExamHeader from "@/components/admin/exams/ExamHeader";
import ExamTable from "@/components/admin/exams/ExamTable";
import { ExamPagination } from "@/components/admin/exams/ExamPagination";
import { getExams } from "@/actions/ExamActions";
import { Exam } from "@/types/database-custom";

interface ExamsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Quản lý đề thi | Admin Dashboard",
};

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  const search = params.q || "";

  const { data: exams, count, error } = await getExams(currentPage, pageSize, search);

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md m-6 border border-red-200">
        <h3 className="font-bold">Đã xảy ra lỗi</h3>
        <p>Không thể tải dữ liệu: {error}</p>
      </div>
    );
  }

  const currentData: Exam[] = exams || [];
  const totalItems = count || 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header & Banner */}
        <ExamHeader />

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
          <ExamTable data={currentData} />

          {/* Footer & Pagination */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <ExamPagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
