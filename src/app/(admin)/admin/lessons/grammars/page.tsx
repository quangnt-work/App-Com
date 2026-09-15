import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import GrammarTable from "@/components/admin/lessons/grammars/GrammarTable";
import { getGrammars } from "@/actions/GrammarActions";
import { Pagination } from "@/components/common/Pagination";
import { BookOpen, FileText, Plus } from "lucide-react";

interface GrammarsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
  }>;
}

export const metadata = {
  title: "Quản lý ngữ pháp | Admin Dashboard",
};

export default async function GrammarsPage({ searchParams }: GrammarsPageProps) {
  const params = await searchParams;

  // 1. Lấy params từ URL (Mặc định page 1)
  const currentPage = Number(params.page) || 1;
  const pageSize = 5; // Trong ảnh hiển thị 5 item mỗi trang

  // 2. Gọi Server Action lấy dữ liệu - chỉ lấy bài học type='text'
  const { data: grammars, count, error } = await getGrammars(
    currentPage,
    pageSize,
    "", // search
    "", // category
    "file" // Chỉ lấy bài ngữ pháp type='text'
  );

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md m-6 border border-red-200">
        <h3 className="font-bold">Đã xảy ra lỗi</h3>
        <p>Không thể tải dữ liệu: {error}</p>
      </div>
    );
  }

  const currentData = grammars || [];
  const totalItems = count || 0;

  const formattedData = currentData.map((grammar) => ({
    ...grammar,
    thumbnail: grammar.thumbnail ?? null,
    type: grammar.type as 'text' | 'file' | 'video' | 'audio' | 'quiz',
    status: (grammar.status || 'draft') as 'draft' | 'published' | 'archived',
    category: grammar.category || '',
  }));

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header & Banner */}
        <AdminPageHeader
          title="QUẢN LÝ NGỮ PHÁP"
          icon={BookOpen}
          badgeText="Danh sách bài học ngữ pháp"
          badgeIcon={FileText}
          action={{
            label: "Thêm mới bài học",
            href: "/admin/lessons/grammars/create",
            icon: Plus,
          }}
        />

        {/* Khung Bảng dữ liệu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
          <GrammarTable data={formattedData} />

          {/* Footer & Pagination */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              itemLabel="bài học"
            />
          </div>
        </div>
      </div>
    </div>
  );
}