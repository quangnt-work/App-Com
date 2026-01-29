// src/components/admin/lessons/LessonFilters.tsx
"use client";

import { Search, Layers, Filter } from "lucide-react"; // Đổi icon User -> Layers
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function LessonFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 1. Helper function để update URL params chung cho tất cả các filter
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    
    // Luôn reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  // 2. Xử lý Search (Debounce)
  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams("q", term); // Chỉ cần truyền null hoặc rỗng sẽ tự delete trong hàm helper
  }, 300);

  // 3. Xử lý Category (SỬA LỖI: Thêm hàm này)
  const handleCategoryFilter = (category: string) => {
    updateParams("category", category);
  };

  // 4. Xử lý Status
  const handleStatusFilter = (status: string) => {
    updateParams("status", status);
  };

  // Lấy giá trị hiện tại từ URL để sync với UI
  const currentStatus = searchParams.get("status") || "all";
  const currentCategory = searchParams.get("category") || "";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* --- Search Box --- */}
        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên bài học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={searchParams.get("q")?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- Category Filter (ĐÃ SỬA) --- */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <div className="relative">
            {/* Đổi icon User thành Layers hoặc Filter */}
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              value={currentCategory} // Sync giá trị với URL
              onChange={(e) => handleCategoryFilter(e.target.value)} // Thêm sự kiện onChange
            >
              <option value="">Tất cả danh mục</option>
              <option value="CNTT">Công nghệ thông tin</option>
              <option value="TIẾNG ANH">Tiếng Anh</option>
              <option value="TIẾNG NGA">Tiếng Nga</option>
              <option value="KHÁC">Khác</option>
            </select>
          </div>
        </div>

        {/* --- Status Filter --- */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { id: "all", label: "Tất cả" },
              { id: "published", label: "Công khai" },
              { id: "draft", label: "Nháp" },
            ].map((status) => {
              const isActive = currentStatus === status.id;
              return (
                <button
                  key={status.id}
                  onClick={() => handleStatusFilter(status.id)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? "bg-white shadow text-blue-600" // Có thể đổi màu text theo status nếu muốn
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}