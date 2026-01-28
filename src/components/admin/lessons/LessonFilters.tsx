// src/components/admin/lessons/LessonFilters.tsx
"use client";


import { Search, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";


export default function LessonFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);


  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    replace(`${pathname}?${params.toString()}`);
  };


  const currentStatus = searchParams.get("status") || "all";


  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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


        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
              <option value="">Tất cả danh mục</option>
              <option value="cntt">Công nghệ thông tin</option>
              <option value="language">Ngoại ngữ</option>
            </select>
          </div>
        </div>


        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                currentStatus === "all" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => handleStatusFilter("published")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                currentStatus === "published" ? "bg-white shadow text-green-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Công khai
            </button>
            <button
              onClick={() => handleStatusFilter("draft")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                currentStatus === "draft" ? "bg-white shadow text-gray-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Nháp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}