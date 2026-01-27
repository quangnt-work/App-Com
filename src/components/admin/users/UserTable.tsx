'use client'

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { deleteUser, UserProfile } from "@/actions/user-actions"; // Import Action

// UI Components (Giả định bạn đang dùng Shadcn UI)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/modals/confirm-modal"; // Modal xác nhận xóa
import { toast } from "sonner"; // Hoặc sonner
import { MoreHorizontal, Edit, Trash, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserTableProps {
  data: UserProfile[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function UserTable({ data, totalCount, currentPage, pageSize }: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mở modal xóa
  const onConfirmDelete = (user: UserProfile) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  // Gọi Server Action để xóa
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      const res = await deleteUser(selectedUser.id);
      if (res.success) {
        toast.success("Đã xóa người dùng thành công.");
        setOpenDeleteModal(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Bạn có chắc chắn muốn xóa?"
        description={`Hành động này không thể hoàn tác. Tài khoản ${selectedUser?.email} sẽ bị xóa vĩnh viễn.`}
      />

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Thông tin cá nhân</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  {/* Avatar */}
                  <TableCell>
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                      <AvatarFallback className="bg-sky-100 text-sky-700 font-bold">
                        {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Name & Email */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.full_name || "Chưa đặt tên"}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">
                      {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-gray-500">
                    {format(new Date(user.created_at), "dd 'thg' MM, yyyy", { locale: vi })}
                  </TableCell>

                  {/* Actions Menu */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-200">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Edit Action - Có thể dẫn tới trang chi tiết */}
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        {/* Delete Action */}
                        <DropdownMenuItem onClick={() => onConfirmDelete(user)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash className="mr-2 h-4 w-4" /> Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalCount)} trong số {totalCount} kết quả
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Sau <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
}