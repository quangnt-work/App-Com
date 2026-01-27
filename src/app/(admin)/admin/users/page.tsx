import { Suspense } from "react";
import Link from "next/link";
import { getUsers } from "@/actions/user-actions";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserTableToolbar } from "@/components/admin/users/UserTableToolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader"; // Giả định có component chung này

export const metadata = {
  title: "Quản lý người dùng",
  description: "Danh sách và quản lý tài khoản người dùng hệ thống",
};

export default async function UserManagementPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  // Parse các param từ URL (có giá trị mặc định)
  const page = Number(params?.page) || 1;
  const query = typeof params?.query === 'string' ? params.query : "";
  const role = typeof params?.role === 'string' ? params.role : "ALL";
  const pageSize = 10;

  // Gọi Server Action (Fetch dữ liệu ngay tại server)
  const { data, count, error } = await getUsers({ page, pageSize, query, role });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Người dùng</h2>
            <p className="text-muted-foreground">
                Quản lý danh sách người dùng và phân quyền hệ thống.
            </p>
        </div>
        <div className="flex items-center space-x-2">
           {/* Nút thêm mới - Dẫn tới trang tạo hoặc mở modal */}
           {/* Nếu bạn dùng Modal thì component này cần chuyển thành Client Component hoặc nhúng Client Component Button vào đây */}
           <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
              <Link href="/admin/users/new">
                <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
              </Link>
           </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toolbar - Thanh tìm kiếm và lọc */}
        <UserTableToolbar />

        {/* Table - Hiển thị dữ liệu */}
        <Suspense fallback={<div className="p-10 text-center">Đang tải dữ liệu...</div>}>
          {error ? (
             <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
               Lỗi: {error}
             </div>
          ) : (
            <UserTable 
              data={data} 
              totalCount={count}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}